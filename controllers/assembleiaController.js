import Database from "../db/database.js";
import AssembleiaRepository            from "../repositories/assembleiaRepository.js";
import ConsorcioRepository             from "../repositories/consorcioRepository.js";
import CotaRepository                  from "../repositories/cotaRepository.js";
import PagamentoRepository             from "../repositories/pagamentoRepository.js";
import SaldoConsorcioRepository        from "../repositories/saldoConsorcioRepository.js";
import MovimentacaoConsorcioRepository from "../repositories/movimentacaoConsorcioRepository.js";

export default class AssembleiaController {

    #repo;
    #repoCon;
    #repoCota;
    #repoPagamento;
    #repoSaldo;
    #repoMov;

    constructor() {
        this.#repo          = new AssembleiaRepository();
        this.#repoCon       = new ConsorcioRepository();
        this.#repoCota      = new CotaRepository();
        this.#repoPagamento = new PagamentoRepository();
        this.#repoSaldo     = new SaldoConsorcioRepository();
        this.#repoMov       = new MovimentacaoConsorcioRepository();
    }

    // GET /assembleia/:consorcioId
    async listarAssembleias(req, res) {
        try {
            const { consorcioId } = req.params;
            const assembleias = await this.#repo.listarComStatus(consorcioId);
            return res.json(assembleias);
        } catch (erro) {
            console.error('Erro ao listar assembleias:', erro);
            return res.status(500).json({ msg: "Erro ao listar assembleias", erro: erro.message });
        }
    }

    // POST /assembleia
    async realizarAssembleia(req, res) {
        const banco = new Database();

        try {
            const { idConsorcio, numeroAssembleia } = req.body;

            // Injeta o mesmo banco em todos os repos — garante a mesma transação
            this.#repo.banco        = banco;
            this.#repoCon.banco     = banco;
            this.#repoCota.banco    = banco;
            this.#repoPagamento.banco = banco;
            this.#repoSaldo.banco   = banco;
            this.#repoMov.banco     = banco;

            if (!idConsorcio || !numeroAssembleia) {
                return res.status(400).json({
                    msg: "Id do consórcio ou número da assembleia não enviado!"
                });
            }

            // Busca e valida o consórcio
            const listaConsorcio = await this.#repoCon.obter(idConsorcio);
            const consorcio = listaConsorcio?.[0];

            if (!consorcio || consorcio.status !== "EM PROCESSO") {
                return res.status(400).json({ msg: "Consórcio inválido para assembleia!" });
            }

            // Busca a assembleia do mês
            const assembleias = await this.#repo.obterPorNumero(idConsorcio, numeroAssembleia);
            const assembleia  = Array.isArray(assembleias) ? assembleias[0] : assembleias;

            if (!assembleia) {
                return res.status(404).json({ msg: "Assembleia não encontrada!" });
            }
            if (assembleia.cot_id) {
                return res.status(400).json({ msg: "Esta assembleia já foi realizada!" });
            }

            // Busca cotas ainda não contempladas para o sorteio
            const listaCotas = await this.#repoCota.listarRegular(idConsorcio);
            if (!listaCotas || listaCotas.length === 0) {
                return res.status(400).json({ msg: "Nenhuma cota disponível para sorteio!" });
            }

            await banco.AbreTransacao();

            // ── Sorteio ────────────────────────────────────────────────────────
            const cotaSorteada = listaCotas[Math.floor(Math.random() * listaCotas.length)];

            // 1. Registra a cota vencedora na assembleia
            await this.#repo.atualizarCota(assembleia.ass_id, cotaSorteada.id);

            // 2. Marca a cota como CONTEMPLADA
            await this.#repoCota.marcarComoContemplada(cotaSorteada.id);

            // 3. Adiciona o ID da assembleia a todos os pagamentos CONFIRMADOS da cota sorteada
            await this.#repoPagamento.adicionarAssembleiaAosPagamentosConfirmados(cotaSorteada.id, assembleia.ass_id);

            // 4. Debita o valor do prêmio do saldo do consórcio
            const valorPremio = Number(consorcio.valorPremio);
            await this.#repoSaldo.debitar(idConsorcio, valorPremio);

            // 5. Registra movimentação de SAIDA no histórico
            await this.#repoMov.inserirSaida(idConsorcio, assembleia.ass_id, valorPremio);

            // 6. Verifica se todas as assembleias foram realizadas
            const todasRealizadas = await this.#repo.todasRealizadas(idConsorcio);
            if (todasRealizadas) {
                // Se todas foram realizadas, finaliza o consórcio
                await this.#repoCon.atualizarStatus(idConsorcio, "FINALIZADO");
            }

            await banco.Commit();

            console.log(`Assembleia #${numeroAssembleia} realizada — cota ${cotaSorteada.numero} contemplada — prêmio R$${valorPremio.toFixed(2)} debitado`);

            if (todasRealizadas) {
                console.log(`✓ Consórcio #${idConsorcio} FINALIZADO — todas as ${numeroAssembleia} assembleias foram realizadas`);
            }

            return res.status(200).json({
                msg: "Assembleia realizada com sucesso!",
                cotaSorteada: {
                    id:     cotaSorteada.id,
                    numero: cotaSorteada.numero
                }
            });

        } catch (ex) {
            await banco.Rollback();
            console.error('Erro na assembleia:', ex);
            return res.status(500).json({
                msg:   "Erro durante o processo de assembleia",
                error: ex.message
            });
        }
    }
}
