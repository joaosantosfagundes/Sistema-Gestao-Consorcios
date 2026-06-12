import express from 'express';
import pagamentoController from '../controllers/pagamentoController.js';

const router = express.Router();
const controller = new pagamentoController();


router.post('/pix', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Gerar QR Code PIX'
    controller.gerarPix(req, res);
});

router.post('/simular', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Simular pagamento PIX (dev)'
    controller.simularPagamento(req, res);
});

router.post('/webhook', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Webhook de confirmação de pagamento'
    controller.webhook(req, res);
});

router.post('/', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Criar um novo pagamento'
    controller.criar(req, res);
});

router.get('/cota/:id', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Listar pagamentos por cota'
    controller.listarPorCota(req, res);
});

router.get('/', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Listar todos os pagamentos'
    controller.listar(req, res);
});

router.get('/:id', (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Buscar pagamento por ID'
    controller.buscarPorId(req, res);
});

export default router;
