import express from 'express';
import CotaController from '../controllers/cotaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new CotaController();
const auth = new AuthMiddleware();

router.post('/', (req, res) => {
    // #swagger.tags = ['Cota']
    // #swagger.summary = "Compra uma cota disponível"
    controller.comprarCota(req, res);
});

router.delete('/reserva/:cotaId', (req, res) => {
    // #swagger.tags = ['Cota']
    // #swagger.summary = 'Libera uma cota reservada não paga'
    controller.liberarCota(req, res);
});

router.get('/minhasCotas', auth.validar, (req, res) => {
    // #swagger.tags = ['Cota']
    // #swagger.summary = "Lista todas as cotas associadas a conta do usuário"
    controller.listarPorUsuarioLogado(req, res);
});

router.get('/disponiveis/:consorcioId', (req, res) => {
    // #swagger.tags = ['Cota']
    // #swagger.summary = "Lista as cotas disponíveis de um consórcio"
    controller.listarCotasDisponiveis(req, res);
});

router.get('/usuario/:usuarioId', (req, res) => {
    // #swagger.tags = ['Cota']
    // #swagger.summary = "Lista as cotas de um usuário"
    controller.listarCotasPorUsuario(req, res);
});

export default router;
