import UsuarioEntity from "../entities/usuarioEntity.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";


export default class UsuarioController {

    #repo;

    constructor() {
        this.#repo = new UsuarioRepository();
    }

    async listar(req, res) {
        try{
            let entidades = await this.#repo.listar();
            if(entidades.length == 0) {
                return res.status(404).json({msg: "Nenhuma entidade encontrada!"})
            }
            
            return res.status(200).json(entidades);
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição"});
        }
    }

    async gravar(req, res) {
        try{
            let {nome, email, senha} = req.body;

            let entidade = new UsuarioEntity(0, nome, email, senha, 'S');
            if(entidade.validar()) {
                let result = await this.#repo.gravar(entidade);
                
                return res.status(201).json(entidade);
            }
            else {
                return res.status(400).json({msg: "Parâmetros incorretos. Por favor confira as informações do usuário!"});
            }

        }
        catch(error) {
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição"});
        }
    }

        async obter(req, res) {
        try{
            let {id} = req.params;

            let usuario = await this.#repo.obter(id);
            if(usuario == null)
                return res.status(404).json({msg: "Usuário não encontrado!"});

            return res.status(200).json(usuario);
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({msg: "Erro ao processar requisição"});
        }
    }

}