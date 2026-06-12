import Repository from "./repository.js";
import SaldoAdministradorEntity from "../entities/saldoadmEntity.js";

export default class SaldoAdmRepository extends Repository {

    constructor() {
        super();
    }

    async buscarPorUsuario(usuarioId) {
        const rows = await this.banco.ExecutaComando(
            "SELECT * FROM tb_saldoadministrador WHERE usu_id = ?",
            [usuarioId]
        );
        return rows[0] ? SaldoAdministradorEntity.toMap(rows[0]) : null;
    }

    // Acumula o valor se já existir, cria do zero se não existir
    async acumular(usuarioId, valor) {
        const existe = await this.banco.ExecutaComando(
            "SELECT sad_id FROM tb_saldoadministrador WHERE usu_id = ?",
            [usuarioId]
        );

        if (existe.length > 0) {
            return await this.banco.ExecutaComandoNonQuery(
                "UPDATE tb_saldoadministrador SET sad_valor = sad_valor + ?, sad_dataatualizacao = NOW() WHERE usu_id = ?",
                [valor, usuarioId]
            );
        }

        return await this.banco.ExecutaComandoNonQuery(
            "INSERT INTO tb_saldoadministrador (usu_id, sad_valor, sad_dataatualizacao) VALUES (?, ?, NOW())",
            [usuarioId, valor]
        );
    }
}
