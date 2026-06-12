import express from 'express';
import ConsorcioController from '../controllers/consorcioController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new ConsorcioController();
const auth = new AuthMiddleware();


router.get("/", (req, res) => {
    // #swagger.tags = ['Consórcio']
    // #swagger.summary = "Lista todos os consórcios cadastrados"
    controller.listar(req, res);
});

router.get("/meusConsorcios", auth.validar, (req, res) => {
    // #swagger.tags = ['Consórcio']
    // #swagger.summary = "Lista todos os consórcios cadastrados associados a conta do usuário"
    controller.listarPorUsuarioLogado(req, res);
});

router.get("/:con_id/pagamentos", auth.validar,(req,res) => {
    // #swagger.tags = ['Consórcio']
    // #swagger.summary = "Lista os pagamentos associados a um consórcio específico (apenas para usuários associados ao consórcio)"

        controller.listarPagamentosConsorcio(req,res)
});


router.post("/", auth.validar, (req, res) => {
    // #swagger.tags = ['Consórcio']
    // #swagger.summary = "Cadastra um novo consórcio"
    /* #swagger.security = [{ "jwt": [] }] */
    controller.cadastrar(req, res);
});

export default router;
