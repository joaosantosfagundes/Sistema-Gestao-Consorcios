import Database from "../db/database.js";
import UsuarioEntity from "../entities/usuarioEntity.js";
import Repository from "./repository.js";


export default class UsuarioRepository extends Repository {


    constructor() {
        super();
    }

    async listar() {

    let sql = "select * from tb_usuario";

    let rows = await this.banco.ExecutaComando(sql);

    let entidades = [];

    for (let row of rows) {
        entidades.push(UsuarioEntity.toMap(row));
    }

    return entidades;
    }
    
    async gravar(entidade) {
        let sql = "insert into tb_usuario (usu_nome, usu_email, usu_senha, usu_ativo) values (?, ?, ?, ?)";
        let valores = [entidade.nome, entidade.email, entidade.senha, entidade.ativo];

        let result = await this.banco.ExecutaComandoLastInserted(sql, valores);

        entidade.id = result;

        return true;
    }

    async obter(id) {
        let sql = "select * from tb_usuario where usu_id = ?";

        let valores = [id];

        let rows = await this.banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            return UsuarioEntity.toMap(rows[0]);
        }

        return null;
    }

    async validarAcesso(email, senha) {
        let sql = "select * from tb_usuario where usu_email = ? and usu_senha = ?";

        let valores = [email, senha];

        let rows = await this.banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            return UsuarioEntity.toMap(rows[0]);
        }

        return null;
    }

}