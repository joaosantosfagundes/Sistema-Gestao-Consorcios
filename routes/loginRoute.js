import express from 'express';
import LoginController from '../controllers/loginController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new LoginController();
const auth = new AuthMiddleware();

router.post("/", (req, res) => {
    // #swagger.tags = ['Login']
    // #swagger.summary = 'Gerar token de autenticação'
    controller.token(req, res);
});

router.get("/usuario", auth.validar.bind(auth), (req, res) => {
    res.json(req.usuarioLogado);
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true });

    res.json({ msg: "Logout realizado" });
});

export default router;