import Database from "../db/database.js";
import ConsorcioEntity from "../entities/consorcioEntity.js";
import AssembleiaRepository from "../repositories/assembleiaRepository.js";
import ConsorcioRepository from "../repositories/consorcioRepository.js";
import CotaRepository from "../repositories/cotaRepository.js";
import PagamentoRepository from "../repositories/pagamentoRepository.js";

export default class ConsorcioService {

    #consorcioRepository;
    #assembleiaRepository;
    #cotaRepository;
    #pagamentoRepository;
   
    constructor() {
        this.#consorcioRepository = new ConsorcioRepository();
        this.#assembleiaRepository = new AssembleiaRepository();
        this.#cotaRepository = new CotaRepository();
       
    }

    async cadastrarConsorcio(dados) {

        let banco = new Database();

        try {
            this.#consorcioRepository.banco = banco;
            this.#assembleiaRepository.banco = banco;
            this.#cotaRepository.banco = banco;
         

            const taxa = dados.taxaAdministracao / 100;
            const fundo = dados.fundoReserva / 100;

            const valorBaseMensal = dados.valorPremio / dados.quantidadeCotas;
            const valorMensal = valorBaseMensal * (1 + taxa + fundo);

            const dataInicio = new Date();
            const dataFim = new Date();
            dataFim.setMonth(dataInicio.getMonth() + Number(dados.quantidadeCotas));

            let consorcio = new ConsorcioEntity(
                0,
                dados.nome,
                dados.usuarioId, 
                dados.quantidadeCotas,
                dados.valorPremio,
                taxa,
                fundo,
                Number(valorMensal.toFixed(2)),
                dados.diaAssembleia,
                dataInicio.toISOString().split("T")[0],
                dataFim.toISOString().split("T")[0],
                "EM PROCESSO"
            );

            if (!consorcio.validar()) {
                throw new Error("Os dados do consórcio não foram preenchidos corretamente");
            }

            await banco.AbreTransacao();

            const resultado = await this.#consorcioRepository.cadastrar(consorcio);

            if (!resultado) {
                throw new Error("Erro ao inserir consórcio no banco de dados");
            }

            const consorcioId = consorcio.id;

            await this.#cotaRepository.gerarCotas(consorcioId, dados.quantidadeCotas);

            const cotas = await this.#cotaRepository.listarPorConsorcio(consorcioId);

            // Gerar assembleias mensais
            let dataAssembleia = new Date(dataInicio);
            dataAssembleia.setMonth(dataAssembleia.getMonth() + 1);
            dataAssembleia.setDate(dados.diaAssembleia);

            for (let i = 0; i < dados.quantidadeCotas; i++) {
                const dataFormatada = `${dataAssembleia.getFullYear()}-${
                    String(dataAssembleia.getMonth() + 1).padStart(2, "0")
                }-${
                    String(dados.diaAssembleia).padStart(2, "0")
                }`;

                await this.#assembleiaRepository.gravar({
                    numero: i + 1,
                    consorcioId: consorcioId,
                    data: dataFormatada,
                    cotaId: null
                });

                dataAssembleia.setMonth(dataAssembleia.getMonth() + 1);
            }

            await banco.Commit();

            return {
                id: consorcioId,
                cotasGeradas: cotas.length,
                //pagamentosGerados: pagamentosCriados,
                assembleiasGeradas: dados.quantidadeCotas,
                valorMensal: Number(valorMensal.toFixed(2))
            };

        } catch (erro) {
            await banco.Rollback();
            throw erro;
        }
    }

    async listarPagamentosConsorcio(consorcioId){

        return await this.#consorcioRepository.listarPagamentosConsorcio(consorcioId);

    }
}
