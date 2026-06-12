import SaldoConsorcioRepository from "../repositories/saldoConsorcioRepository.js";
import SaldoAdmRepository from "../repositories/saldoAdmRepository.js";
import MovimentacaoConsorcioRepository from "../repositories/movimentacaoConsorcioRepository.js";
import MovimentacaoAdmRepository from "../repositories/movimentacaoAdmRepository.js";

export default class FinanceiroService {

    #saldoConRepo;
    #saldoAdmRepo;
    #movConRepo;
    #movAdmRepo;

    constructor() {
        this.#saldoConRepo  = new SaldoConsorcioRepository();
        this.#saldoAdmRepo  = new SaldoAdmRepository();
        this.#movConRepo    = new MovimentacaoConsorcioRepository();
        this.#movAdmRepo    = new MovimentacaoAdmRepository();
    }

    //  Consórcio 

    async buscarSaldoConsorcio(consorcioId) {
        const saldo = await this.#saldoConRepo.buscarPorConsorcio(consorcioId);

        // retorna saldo zero caso ainda não haja nenhum pagamento confirmado
        if (!saldo) {
            return { consorcioId, saldo: 0 };
        }

        return saldo;
    }

    async listarMovimentacoesConsorcio(consorcioId) {
        return await this.#movConRepo.listarPorConsorcio(consorcioId);
    }

    //  Administrador 

    async buscarSaldoAdmin(usuarioId) {
        const saldo = await this.#saldoAdmRepo.buscarPorUsuario(usuarioId);

        if (!saldo) {
            return { usuarioId, saldo: 0 };
        }

        return saldo;
    }

    async listarMovimentacoesAdmin(usuarioId) {
        return await this.#movAdmRepo.listarPorUsuario(usuarioId);
    }
}
