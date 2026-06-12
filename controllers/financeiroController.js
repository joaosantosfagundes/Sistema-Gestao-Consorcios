import FinanceiroService from "../service/financeiroService.js";

export default class FinanceiroController {

    #service;

    constructor() {
        this.#service = new FinanceiroService();
    }

    //  Consórcio 

    async buscarSaldoConsorcio(req, res) {
        try {
            const { consorcioId } = req.params;
            const saldo = await this.#service.buscarSaldoConsorcio(consorcioId);
            return res.json(saldo);
        } catch (erro) {
            console.error('Erro ao buscar saldo do consórcio:', erro);
            return res.status(500).json({ msg: "Erro ao buscar saldo do consórcio", erro: erro.message });
        }
    }

    async listarMovimentacoesConsorcio(req, res) {
        try {
            const { consorcioId } = req.params;
            const movimentacoes = await this.#service.listarMovimentacoesConsorcio(consorcioId);
            return res.json(movimentacoes);
        } catch (erro) {
            console.error('Erro ao listar movimentações do consórcio:', erro);
            return res.status(500).json({ msg: "Erro ao listar movimentações do consórcio", erro: erro.message });
        }
    }

    //  Administrador 

    async buscarSaldoAdmin(req, res) {
        try {
            const { usuarioId } = req.params;
            const saldo = await this.#service.buscarSaldoAdmin(usuarioId);
            return res.json(saldo);
        } catch (erro) {
            console.error('Erro ao buscar saldo do administrador:', erro);
            return res.status(500).json({ msg: "Erro ao buscar saldo do administrador", erro: erro.message });
        }
    }

    async listarMovimentacoesAdmin(req, res) {
        try {
            const { usuarioId } = req.params;
            const movimentacoes = await this.#service.listarMovimentacoesAdmin(usuarioId);
            return res.json(movimentacoes);
        } catch (erro) {
            console.error('Erro ao listar movimentações do administrador:', erro);
            return res.status(500).json({ msg: "Erro ao listar movimentações do administrador", erro: erro.message });
        }
    }
}
