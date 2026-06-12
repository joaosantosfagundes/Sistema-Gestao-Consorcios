import Repository from "./repository.js";
import MovimentacaoAdministradorEntity from "../entities/movimentacaoadmEntity.js";

export default class MovimentacaoAdmRepository extends Repository {

    constructor() {
        super();
    }

    async listarPorUsuario(usuarioId) {
        const rows = await this.banco.ExecutaComando(
            "SELECT * FROM tb_movimentacaoadministrador WHERE usu_id = ? ORDER BY mva_data DESC",
            [usuarioId]
        );
        return rows.map(row => MovimentacaoAdministradorEntity.toMap(row));
    }

    async listarPorConsorcio(consorcioId) {
        const rows = await this.banco.ExecutaComando(
            "SELECT * FROM tb_movimentacaoadministrador WHERE con_id = ? ORDER BY mva_data DESC",
            [consorcioId]
        );
        return rows.map(row => MovimentacaoAdministradorEntity.toMap(row));
    }

    async inserir(usuarioId, consorcioId, pagamentoId, valor) {
        return await this.banco.ExecutaComandoNonQuery(
            "INSERT INTO tb_movimentacaoadministrador (usu_id, con_id, pag_id, mva_tipo, mva_valor, mva_data) VALUES (?, ?, ?, 'CREDITO', ?, NOW())",
            [usuarioId, consorcioId, pagamentoId, valor]
        );
    }
}
