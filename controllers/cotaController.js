import CotaRepository from "../repositories/cotaRepository.js";
import CotaService    from "../service/cotaService.js";

export default class cotaController {

    #repoCota;
    #servCota;

    constructor() {
        this.#repoCota = new CotaRepository();
        this.#servCota = new CotaService();
    }

    async comprarCota(req, res) {
        try {
            const { cotaID, usuarioId } = req.body;
            const resultado = await this.#servCota.comprarCota(cotaID, usuarioId);
            res.status(200).json(resultado);
        } catch (erro) {
            res.status(400).json({ error: erro.message });
        }
    }

    async liberarCota(req, res) {
        try {
            const { cotaId } = req.params;
            await this.#servCota.liberarCota(cotaId);
            res.status(200).json({ msg: 'Cota liberada com sucesso' });
        } catch (erro) {
            const status = erro.message.includes('não pode') ? 400 : 500;
            res.status(status).json({ msg: erro.message });
        }
    }

    async listarCotasDisponiveis(req, res) {
        try {
            const { consorcioId } = req.params;
            const cotas = await this.#servCota.listarCotasDisponiveis(consorcioId);
            res.status(200).json(cotas);
        } catch (erro) {
            res.status(400).json({ error: erro.message });
        }
    }

    async listarCotasPorUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            const cotas = await this.#servCota.listarCotasPorUsuario(usuarioId);
            res.status(200).json(cotas);
        } catch (erro) {
            res.status(400).json({ error: erro.message });
        }
    }

    async listarPorUsuarioLogado(req, res) {
        try {
            const usuarioId = req.usuarioLogado.id;
            const lista = await this.#repoCota.listarPorUsuarioLogado(usuarioId);
            
            return res.status(200).json(lista);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Erro ao processar requisição' });
        }
    }
}
