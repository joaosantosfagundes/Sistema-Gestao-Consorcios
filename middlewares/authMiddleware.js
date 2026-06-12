import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/usuarioRepository.js';
const SEGREDO_JWT = process.env.JWT_SECRET
export default class AuthMiddleware {

    token(id, nome, email) {
        let token = jwt.sign({
            id: id,
            nome: nome,
            email: email
        }, SEGREDO_JWT);

        return token;
    }

    async validar(req, res, next) {
        if(req.cookies.token) {
            //se existir no cabeçalho recupera o valor
            let token = req.cookies.token;
            
            try {
                //validar o token e recupera as informações do usuário que estão no token
                let payload = jwt.verify(token, SEGREDO_JWT);
                let usuarioRepository = new UsuarioRepository();
                //valida o nosso usuário no banco de dados
                let usuario = await usuarioRepository.obter(payload.id)
                if(usuario) {
                    if(usuario.ativo) {
                        req.usuarioLogado = usuario;
                        next();
                    }
                    else {
                        return res.status(401).json({msg: "Usuário inativo"});
                    }
                }
                else {
                    return res.status(404).json({msg: "Usuário não encontrado"});
                }
            }
            catch(ex) {
                console.log(ex)
                return res.status(401).json({msg: "Token inválido!"});
            }
        }
        else {
            return res.status(401).json({msg: "Necessário Login!"});
        }
    }
}