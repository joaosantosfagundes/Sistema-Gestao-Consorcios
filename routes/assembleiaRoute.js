import express from 'express';
import AssembleiaController from '../controllers/assembleiaController.js';

const router = express.Router();

let controller = new AssembleiaController();


router.get("/:consorcioId", (req, res) => {
    // #swagger.tags = ['Assembleia']
    // #swagger.summary = "Lista assembleias de um consórcio com status de pagamentos"
    controller.listarAssembleias(req, res);
});

router.post("/", (req, res) => {

    // #swagger.tags = ['Assembleia']
    // #swagger.summary = "Realiza uma assembleia"
        /* #swagger.security = [{
            "jwt": []
    }] */
    controller.realizarAssembleia(req, res);
})

export default router;