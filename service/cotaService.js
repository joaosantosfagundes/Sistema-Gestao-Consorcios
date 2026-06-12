import CotaRepository      from "../repositories/cotaRepository.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";
import ConsorcioRepository from "../repositories/consorcioRepository.js";
import Database            from "../db/database.js";
import axios               from "axios";

export default class CotaService {

    #cotaRepository;
    #pagamentoRepository;
    #concorciorepository;

    constructor() {
        this.#cotaRepository      = new CotaRepository();
        this.#pagamentoRepository = new PagamentoRepository();
        this.#concorciorepository = new ConsorcioRepository();
    }

    async comprarCota(cotaId, usuarioId) {
        const banco = new Database();
        this.#cotaRepository.banco      = banco;
        this.#pagamentoRepository.banco = banco;
        this.#concorciorepository.banco = banco;

        await banco.AbreTransacao();

        let primeiroPagamentoId;
        let valorMensal;

        try {
            const atributo = await this.#cotaRepository.atribuirCota(cotaId, usuarioId);
            if (!atributo) throw new Error('Cota já foi comprada por outro usuário ou não existe');

            const info = await this.#cotaRepository.buscarDadosFinanceiros(cotaId);
            if (!info) throw new Error('Não foi possível obter dados do consórcio para esta cota');

            const listaConsorcio = await this.#concorciorepository.obter(info.con_id);
            const consorcio = listaConsorcio[0];
            if (!consorcio) throw new Error('Consórcio não encontrado');

            const totalParcelas = consorcio.quantidadeCotas;
            valorMensal = Number(consorcio.valorMensal);

            const dataBase = new Date();
            for (let i = 1; i <= totalParcelas; i++) {
                const d = new Date(dataBase);
                d.setMonth(d.getMonth() + (i - 1));
                const dataFormatada = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} 00:00:00`;

                const pag = await this.#pagamentoRepository.inserir({
                    cot_id: cotaId, 
                    pag_valor: valorMensal,
                    pag_status: 'PENDENTE', 
                    pag_datageracao: dataFormatada
                });
                if (i === 1) primeiroPagamentoId = pag.id;
            }

            await banco.Commit();
        } catch (erro) {
            await banco.Rollback();
            throw erro;
        }

        const response = await axios.post(
            'https://api.abacatepay.com/v1/pixQrCode/create',
            {
                amount:      Math.round(valorMensal * 100),
                description: `Parcela 1 — Cota ${cotaId}`,
                metadata:    { pagamentoId: primeiroPagamentoId }
            },
            { headers: { Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}` } }
        );

        return {
            message:     'Cota comprada com sucesso',
            pagamentoId: primeiroPagamentoId,
            pixId:       response.data.data.id,
            qrCode:      response.data.data.brCodeBase64,
            copiaCola:   response.data.data.brCode,
            status:      response.data.data.status
        };
    }

    async liberarCota(cotaId) {
        const rows = await this.#cotaRepository.banco.ExecutaComando(
            `SELECT cot_status FROM tb_cota WHERE cot_id = ?`, [cotaId]
        );
        const cota = rows[0];
        if (!cota) throw new Error('Cota não encontrada');
        if (cota.cot_status !== 'RESERVADA')
            throw new Error('Cota já confirmada — não pode ser liberada');

        await this.#pagamentoRepository.banco.ExecutaComandoNonQuery(
            `DELETE FROM tb_pagamento WHERE cot_id = ? AND pag_status = 'PENDENTE'`, [cotaId]
        );
        await this.#cotaRepository.liberarCota(cotaId);
    }

    async listarCotasDisponiveis(consorcioId) {
        return await this.#cotaRepository.listarDisponiveis(consorcioId);
    }

    async listarCotasPorUsuario(usuarioId) {
        return await this.#cotaRepository.listarPorUsuario(usuarioId);
    }
}
