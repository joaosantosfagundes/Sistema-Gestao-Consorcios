import CotaEntity from "../entities/cotaEntity.js";
import Repository from "./repository.js";

export default class CotaRepository extends Repository {

    constructor() {
        super();
    }

    async inserirCotas(cotas) {
        const sql = `INSERT INTO tb_cota (con_id, cot_numero, cot_status) VALUES ?`;
        return await this.banco.ExecutaComando(sql, [cotas]);
    }

    async buscarCotaDisponivel(cotaId) {
        const sql = `SELECT * FROM tb_cota WHERE cot_id = ? AND usu_id IS NULL`;
        const rows = await this.banco.ExecutaComando(sql, [cotaId]);
        return rows[0] || null;
    }

    async atribuirCota(cotaId, usuarioId) {
        const sql = `UPDATE tb_cota SET usu_id = ?, cot_status = 'REGULAR' WHERE cot_id = ? AND usu_id IS NULL`;
        const result = await this.banco.ExecutaComando(sql, [usuarioId, cotaId]);
        return result.affectedRows > 0;
    }

    async confirmarCota(cotaId) {
        const sql = `UPDATE tb_cota SET cot_status = 'REGULAR' WHERE cot_id = ?`;
        await this.banco.ExecutaComandoNonQuery(sql, [cotaId]);
    }

    async liberarCota(cotaId) {
        const sql = `UPDATE tb_cota SET usu_id = NULL, cot_status = 'REGULAR' WHERE cot_id = ?`;
        await this.banco.ExecutaComandoNonQuery(sql, [cotaId]);
    }

    async listarDisponiveis(consorcioId) {
        const sql = `SELECT * FROM tb_cota WHERE con_id = ? AND usu_id IS NULL AND cot_status != 'CONTEMPLADA'`;
        return await this.banco.ExecutaComando(sql, [consorcioId]);
    }

    async listarPorUsuario(usuarioId) {
        const sql = `SELECT * FROM tb_cota WHERE usu_id = ?`;
        return await this.banco.ExecutaComando(sql, [usuarioId]);
    }

    async listarPorUsuarioLogado(usuarioId) {
        const sql = `
            SELECT c.*, cs.con_nome
            FROM tb_cota c
            INNER JOIN tb_consorcio cs ON c.con_id = cs.con_id
            WHERE c.usu_id = ?
        `;
        return await this.banco.ExecutaComando(sql, [usuarioId]);
    }

    async listarPorConsorcio(consorcioId) {
        const sql = `SELECT * FROM tb_cota WHERE con_id = ?`;
        return await this.banco.ExecutaComando(sql, [consorcioId]);
    }

    async listarRegular(consorcioId) {
        let sql = `SELECT * FROM tb_cota WHERE cot_status = 'REGULAR'`;
        const params = [];

        if (consorcioId) {
            sql += ` AND con_id = ?`;
            params.push(consorcioId);
        }

        const rows = await this.banco.ExecutaComando(sql, params);
        return rows.map(row => CotaEntity.toMap(row));
    }

    async buscarDadosFinanceiros(cotaId) {
        const rows = await this.banco.ExecutaComando(`
            SELECT
                c.con_id,
                c.usu_id      AS cot_usu_id,
                co.usu_id     AS con_usu_id,
                co.con_taxaadministracao,
                co.con_fundoreserva
            FROM tb_cota c
            JOIN tb_consorcio co ON co.con_id = c.con_id
            WHERE c.cot_id = ?
        `, [cotaId]);
        return rows[0] || null;
    }

    async buscarCotaPorId(cotaId) {
        const sql = `SELECT * FROM tb_cota WHERE cot_id = ?`;
        const rows = await this.banco.ExecutaComando(sql, [cotaId]);
        return rows[0] || null;
    }

    async gerarCotas(consorcioId, quantidadeCotas) {
        const cotas = [];
        for (let i = 1; i <= quantidadeCotas; i++) {
            cotas.push([consorcioId, i, 'INADIMPLEMTE']);
        }
        return await this.inserirCotas(cotas);
    }

    async marcarComoContemplada(cotaId) {
        const sql = `UPDATE tb_cota SET cot_status = 'CONTEMPLADA' WHERE cot_id = ?`;
        return await this.banco.ExecutaComandoNonQuery(sql, [cotaId]);
    }
}