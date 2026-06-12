import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

let auth = new AuthMiddleware();

let controller = new UsuarioController();

router.get("/", auth.validar, (req, res) => {

    // #swagger.tags = ['Usuário']
    // #swagger.summary = 'Retorna todos os usuários cadastrados'

    //essa configuração faz aparecer o ícone de cadeado no endpoint. Entretanto esse icone servirá apenas como visual. 
    //se tentarmos colocar o nosso jwt manualmente a requisição do swagger não mandará ele, pois as nossas requisições na rota /docs estão configuradas com withCredentials
    /* #swagger.security = [{
            "jwt": []
    }] */
    controller.listar(req, res);
})


router.post("/", (req, res) => {

    // #swagger.tags = ['Usuário']
    // #swagger.summary = "Cadastra um novo usuário"
        /* #swagger.security = [{
            "jwt": []
    }] */
    controller.gravar(req, res);
})

router.get("/:id", auth.validar, (req, res) => {
    // #swagger.tags = ['Usuário']
    // #swagger.summary = "Retorna um usuário através do ID"
        /* #swagger.security = [{
            "jwt": []
    }] */
    controller.obter(req, res);
})
export default router;