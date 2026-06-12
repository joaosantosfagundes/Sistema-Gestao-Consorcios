import PagamentoService from "../service/pagamentoService.js";

export default class PagamentoController {

  
    #service;

    constructor() {
        this.#service = new PagamentoService();
    }

    async criar(req, res) {
        try {
            const { cot_id, pag_valor, pag_status } = req.body;

            if (!cot_id || !pag_valor || !pag_status) {
                return res.status(400).json({ msg: "Todos os campos são obrigatórios" });
            }

            const cotaExiste = await this.#service.buscarCotaPorId(cot_id);
            if (!cotaExiste) {
                return res.status(404).json({ msg: "Cota não encontrada" });
            }

            const pagamento = await this.#service.criarPagamento(req.body);
            console.log('Pagamento criado:', pagamento);
            return res.status(201).json(pagamento);

        } catch (erro) {
            console.error('Erro ao criar pagamento:', erro);
            return res.status(500).json({ msg: "Erro ao criar pagamento", erro: erro.message });
        }
    }

    async gerarPix(req, res) {
        try {
            const { cot_id, valor } = req.body;
            if (!cot_id || !valor) {
                return res.status(400).json({ msg: "cot_id e valor são obrigatórios" });
            }

            const pixData = await this.#service.gerarPix(cot_id, valor);
            console.log('PIX gerado com sucesso');
            return res.json(pixData);

        } catch (erro) {
            console.error('Erro ao gerar PIX:', erro.message);
            return res.status(500).json({ msg: "Erro ao gerar PIX", erro: erro.message });
        }
    }

    async webhook(req, res) {
        try {
            console.log('=== WEBHOOK RECEBIDO ===');
            console.log(JSON.stringify(req.body, null, 2));
            console.log('=======================');

            await this.#service.confirmarPagamento(req.body);
            return res.status(200).send('OK');

        } catch (erro) {
            console.error('Erro no webhook:', erro);
            return res.status(500).json({ msg: "Erro no webhook", erro: erro.message });
        }
    }

    async listar(req, res) {
        try {
            const pagamentos = await this.#service.listarPagamento();
            return res.json(pagamentos);
        } catch (erro) {
            console.error('Erro ao listar pagamentos:', erro);
            return res.status(500).json({ msg: "Erro ao listar pagamentos", erro: erro.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const pagamento = await this.#service.buscarpagamentoId(id);

            if (!pagamento) {
                return res.status(404).json({ msg: "Pagamento não encontrado" });
            }

            return res.json(pagamento);
        } catch (erro) {
            console.error('Erro ao buscar pagamento por ID:', erro);
            return res.status(500).json({ msg: "Erro ao buscar pagamento por ID", erro: erro.message });
        }
    }

    async listarPorCota(req, res) {
        try {
            const cot_id = req.params.cot_id || req.params.id;
            if (!cot_id) {
                return res.status(400).json({ msg: "cot_id é obrigatório na rota" });
            }

            const pagamentos = await this.#service.listarPagamentoCota(cot_id);
            return res.json(pagamentos);

        } catch (erro) {
            console.error('Erro ao listar pagamentos por cota:', erro);
            return res.status(500).json({ msg: "Erro ao listar pagamentos por cota", erro: erro.message });
        }
    }

    async simularPagamento(req, res) {
        try {
            const { pixId } = req.body;
            if (!pixId) {
                return res.status(400).json({ msg: "pixId é obrigatório" });
            }

            const resultado = await this.#service.simularPagamento(pixId);
            return res.json(resultado);
        } catch (erro) {
            console.error('Erro ao simular pagamento:', erro.message);
            return res.status(500).json({ msg: "Erro ao simular pagamento", erro: erro.message });
        }
    }
}
