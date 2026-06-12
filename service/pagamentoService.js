import PagamentoRepository             from "../repositories/pagamentoRepository.js";
import SaldoConsorcioRepository        from "../repositories/saldoConsorcioRepository.js";
import SaldoAdmRepository              from "../repositories/saldoAdmRepository.js";
import MovimentacaoConsorcioRepository from "../repositories/movimentacaoConsorcioRepository.js";
import MovimentacaoAdmRepository       from "../repositories/movimentacaoAdmRepository.js";
import CotaRepository from "../repositories/cotaRepository.js";
import Database from "../db/database.js";
import axios   from 'axios';
import { notificarPagamentoConfirmado, notificarPixGerado } from '../utils/socketManager.js';

export default class PagamentoService {

    #repopag;
    #repoSaldoCon;
    #repoSaldoAdm;
    #repoMovCon;
    #repoMovAdm;
    #repoCota;


    constructor() {
        this.#repopag     = new PagamentoRepository();
        this.#repoSaldoCon = new SaldoConsorcioRepository();
        this.#repoSaldoAdm = new SaldoAdmRepository();
        this.#repoMovCon   = new MovimentacaoConsorcioRepository();
        this.#repoMovAdm   = new MovimentacaoAdmRepository();
        this.#repoCota = new CotaRepository()
    }

    //  Validação de cota 

    async buscarCotaPorId(cot_id) {
        return await this.#repoCota.buscarCotaPorId(cot_id);
    }

    //  Criar pagamento manual 

    async criarPagamento(data) {
        const pagamentos = await this.#repopag.buscarPorCota(data.cot_id);
        const pendente   = pagamentos.find(p => p.pag_status === 'PENDENTE');

        if (pendente) {
            throw new Error('Já existe um pagamento pendente para essa cota.');
        }

        return await this.#repopag.inserir({
            cot_id:     data.cot_id,
            pag_valor:  data.pag_valor,
            pag_status: 'PENDENTE'
        });
    }

    //  Gerar PIX via AbacatePay 

    async gerarPix(cot_id, valor) {
        console.log(`Gerando PIX para cota ${cot_id}`);

        const pagamentos = await this.#repopag.buscarPorCota(cot_id);
        const pendente   = pagamentos.find(p => p.pag_status === 'PENDENTE');

        let pagamentoId;

        if (pendente) {
            if (Number(pendente.pag_valor) !== Number(valor)) {
                throw new Error('Já existe um pagamento pendente com valor diferente.');
            }
            console.log('Pagamento pendente encontrado — gerando novo QR Code');
            pagamentoId = pendente.pag_id;
        } else {
            const novo  = await this.#repopag.inserir({ cot_id, pag_valor: valor, pag_status: 'PENDENTE' });
            pagamentoId = novo.id;
        }

        const response = await axios.post(
            'https://api.abacatepay.com/v1/pixQrCode/create',
            {
                amount:      Math.round(Number(valor) * 100),
                description: `Pagamento cota ${cot_id}`,
                metadata:    { pagamentoId }
            },
            { headers: { Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}` } }
        );

        const pixData = {
            pagamentoId,
            pixId:     response.data.data.id,
            qrCode:    response.data.data.brCodeBase64,
            copiaCola: response.data.data.brCode,
            status:    response.data.data.status
        };

        notificarPixGerado(cot_id, pixData);
        return pixData;
    }

    //  Simular pagamento (apenas dev) 

    async simularPagamento(pixId) {
        const response = await axios.post(
            'https://api.abacatepay.com/v1/pixQrCode/simulate-payment',
            {},
            {
                params:  { id: pixId },
                headers: { Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}` }
            }
        );
        return response.data;
    }

    //  Confirmar pagamento via webhook 

    async confirmarPagamento(webhookData) {
        console.log('=== PAYLOAD WEBHOOK ===', JSON.stringify(webhookData, null, 2));

        const status      = webhookData?.data?.pixQrCode?.status || webhookData?.status;
        const pagamentoId = webhookData?.data?.pixQrCode?.metadata?.pagamentoId
                         || webhookData?.metadata?.pagamentoId;

        console.log(`Status: ${status} | PagamentoId: ${pagamentoId}`);

        if (status !== 'COMPLETED' && status !== 'PAID') return;
        if (!pagamentoId) { console.log('PagamentoId não encontrado'); return; }

        // Conexão compartilhada — mesma transação para todos os repositories
        const banco = new Database();

        this.#repopag.banco      = banco;
        this.#repoSaldoCon.banco = banco;
        this.#repoSaldoAdm.banco = banco;
        this.#repoMovCon.banco   = banco;
        this.#repoMovAdm.banco   = banco;

        await banco.AbreTransacao();

        try {
            // Busca e valida o pagamento
            const pagamento = await this.#repopag.buscarPorId(pagamentoId);
            if (!pagamento) throw new Error("Pagamento não encontrado");

            if (pagamento.pag_status === 'CONFIRMADO') {
                console.log('Pagamento já confirmado — ignorando duplicata');
                await banco.Commit();
                return;
            }

            // Atualiza status do pagamento
            await this.#repopag.atualizarStatus(pagamentoId, 'CONFIRMADO');

            // Reseta cota para REGULAR caso estivesse INADIMPLENTE (pagamento em atraso quitado)
            await this.#repoCota.banco.ExecutaComandoNonQuery(
                `UPDATE tb_cota SET cot_status = 'REGULAR' WHERE cot_id = ? AND cot_status = 'INADIMPLEMTE'`,
                [pagamento.cot_id]
            );

            // Busca dados financeiros do consórcio vinculado à cota
            this.#repoCota.banco = banco;
            const info = await this.#repoCota.buscarDadosFinanceiros(pagamento.cot_id);

            const valor   = Number(pagamento.pag_valor);
            const taxa    = valor * Number(info.con_taxaadministracao);
            const reserva = valor * Number(info.con_fundoreserva);
            const premio  = valor - taxa - reserva;

            // Atualiza saldos
            await this.#repoSaldoCon.acumular(info.con_id,     premio + reserva);
            await this.#repoSaldoAdm.acumular(info.con_usu_id, taxa);   

            // Registra movimentações
            await this.#repoMovCon.inserir(info.con_id, pagamentoId, premio + reserva);
            await this.#repoMovAdm.inserir(info.con_usu_id, info.con_id, pagamentoId, taxa); 

            await banco.Commit();

            notificarPagamentoConfirmado(pagamento.cot_id, { pagamentoId, valor, status: 'CONFIRMADO' });

            console.log(`Pagamento ${pagamentoId} confirmado — prêmio: R$${premio.toFixed(2)}, taxa: R$${taxa.toFixed(2)}, reserva: R$${reserva.toFixed(2)}`);

        } catch (erro) {
            await banco.Rollback();
            console.error('Erro na transação de confirmação:', erro);
            throw erro;
        }
    }

    //  Consultas 

    async listarPagamento() {
        return await this.#repopag.listarTodos();
    }

    async buscarpagamentoId(id) {
        return await this.#repopag.buscarPorId(id);
    }

    async listarPagamentoCota(cot_id) {
        return await this.#repopag.buscarPorCota(cot_id);
    }

    async criarPagamentoSimples(data) {
        return await this.#repopag.inserir(data);
    }
}
