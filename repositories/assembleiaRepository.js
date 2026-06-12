import AssembleiaEntity from "../entities/assembleiaEntity.js";
import Repository from "./repository.js";

export default class AssembleiaRepository extends Repository {

    constructor() {
        super();
    }

    async gravar(assembleia) {
        const sql = `
            insert into tb_assembleia 
            (ass_numero, con_id, ass_data, cot_id) 
            values (?, ?, ?, ?)
        `;

  
        const valores = [assembleia.numero, assembleia.consorcioId, assembleia.data, assembleia.cotaId];

        const result = await this.banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async obterUltimaAssembleia(idConsorcio) {
        const sql = "SELECT * FROM tb_assembleia WHERE con_id = ? ORDER BY ass_id DESC LIMIT 1";
        
        const result = await this.banco.ExecutaComando(sql, [idConsorcio]);

        return result.length > 0 ? result[0] : null;
    }

    async obterPorNumero(consorcioId, numeroAssembleia) {
        const sql = "SELECT * FROM tb_assembleia WHERE con_id = ? AND ass_numero = ?";
        const result = await this.banco.ExecutaComando(sql, [consorcioId, numeroAssembleia]);
        return result;
    }

    async atualizarCota(assId, cotaId) {
        const sql = "UPDATE tb_assembleia SET cot_id = ? WHERE ass_id = ?";
        const result = await this.banco.ExecutaComandoNonQuery(sql, [cotaId, assId]);
        return result;
    }

     async listarComStatus(consorcioId) {
        const sql = `
            SELECT
                a.ass_id,
                a.ass_numero,
                a.ass_data,
                a.cot_id               AS cot_sorteada_id,
                c.cot_numero           AS cot_sorteada_numero,
                u.usu_nome             AS contemplado_nome,
                con.con_valorpremio    AS ass_premio,
                (
                    SELECT COUNT(DISTINCT p.cot_id)
                    FROM tb_pagamento p
                    INNER JOIN tb_cota tc ON tc.cot_id = p.cot_id
                    WHERE tc.con_id = a.con_id
                      AND p.pag_status = 'CONFIRMADO'
                      AND YEAR(p.pag_datageracao)  = YEAR(a.ass_data)
                      AND MONTH(p.pag_datageracao) = MONTH(a.ass_data)
                ) AS cotas_pagas,
                (
                    SELECT COUNT(*)
                    FROM tb_cota tc2
                    WHERE tc2.con_id = a.con_id
                      AND tc2.usu_id IS NOT NULL
                ) AS total_cotas_vendidas
            FROM tb_assembleia a
            LEFT JOIN tb_cota      c ON c.cot_id = a.cot_id
            LEFT JOIN tb_usuario   u ON u.usu_id  = c.usu_id
            LEFT JOIN tb_consorcio con ON con.con_id = a.con_id
            WHERE a.con_id = ?
            ORDER BY a.ass_numero ASC
        `;
        return await this.banco.ExecutaComando(sql, [consorcioId]);
    }

    async todasRealizadas(consorcioId) {
        const sql = `
            SELECT COUNT(*) as total, 
                SUM(CASE WHEN cot_id IS NOT NULL THEN 1 ELSE 0 END) as realizadas
            FROM tb_assembleia
            WHERE con_id = ?
        `;
        const result = await this.banco.ExecutaComando(sql, [consorcioId]);
        if (result.length > 0) {
            const { total, realizadas } = result[0];
            return total > 0 && Number(total) === Number(realizadas); 
        }
        return false;
    }
}