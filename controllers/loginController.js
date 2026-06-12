import AuthMiddleware from "../middlewares/authMiddleware.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";


export default class LoginController {

    #usuarioRepository;

    constructor() {
        this.#usuarioRepository = new UsuarioRepository();
    }

    async token(req, res) {

        try{
            let {email, senha} = req.body;
            if(email && senha) {
                //chama o repository para encontrar usuario com email e senha
                let usuario = await this.#usuarioRepository.validarAcesso(email, senha);
                if(usuario) {
                    //gerar token;
                    let auth = new AuthMiddleware();

                    let token = auth.token(usuario.id, usuario.nome, usuario.email);
                    res.cookie("token", token, {
                        httpOnly: true,
                    })
                    return res.status(200).json({token: token, usuario: usuario});
                }
                else {
                    return res.status(404).json({msg: "Usuário não encontrado"});
                }
            }
            else {
                return res.status(400).json({msg: "Informe um e-mail e uma senha para gerar um token de acesso!"});
            }
        }
        catch(exception) {
            console.log(exception);
            return res.status(500).json({msg: "Erro ao gerar token de acesso"})
        }
    }
}