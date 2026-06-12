import ConsorcioEntity from "../entities/consorcioEntity.js";
import Repository from "./repository.js";


export default class ConsorcioRepository extends Repository {

    constructor() {
        super();
    }

    async listar() {

        let sql = "select * from tb_consorcio";

        let rows = await this.banco.ExecutaComando(sql);
        let lista = [];
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(ConsorcioEntity.toMap(row));
        }

        return lista;

    }

    async listarPorUsuarioLogado(usuarioId) {

        let sql = "select * from tb_consorcio where usu_id = ?";
        let valores = [usuarioId];

        let rows = await this.banco.ExecutaComando(sql, valores);
        let lista = [];
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(ConsorcioEntity.toMap(row));
        }
        
        return lista;
    }

    async cadastrar(entidade) {

        let sql = `
            INSERT INTO tb_consorcio (
                con_nome,
                usu_id,
                con_quantidadecotas,
                con_valorpremio,
                con_taxaadministracao,
                con_fundoreserva,
                con_valormensal,
                con_diaassembleia,
                con_datainicio,
                con_datafim,
                con_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        let valores = [
                    entidade.nome,
                    entidade.usuarioId,
                    entidade.quantidadeCotas,
                    entidade.valorPremio,
                    entidade.taxaAdministracao,
                    entidade.fundoReserva,
                    entidade.valorMensal,
                    entidade.diaAssembleia,
                    entidade.dataInicio,
                    entidade.dataFim,
                    entidade.status
        ];
        
        let idConsorcio = await this.banco.ExecutaComandoLastInserted(sql, valores);
        
        if(idConsorcio > 0) {
            entidade.id = idConsorcio;
            return true;
        }
        

        return false;
    }

    async obter(id) {

        let sql = "select * from tb_consorcio where con_id = ?";
        let valores = [id];

        let rows = await this.banco.ExecutaComando(sql, valores);
        let lista = [];
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i];
            lista.push(ConsorcioEntity.toMap(row));
        }
        
        return lista;
    }

    async listarPagamentosConsorcio(con_id) {

        const sql = `
            SELECT
                p.pag_id,
                p.pag_status,
                p.pag_valor,
                p.pag_datageracao,
                p.pag_datapagamento,

                c.cot_id,
                c.cot_numero,
                c.cot_status,

                u.usu_nome,
                u.usu_email,

                co.con_id,
                co.con_nome,

                a.ass_numero

            FROM tb_pagamento p

            INNER JOIN tb_cota c
                ON c.cot_id = p.cot_id

            INNER JOIN tb_consorcio co
                ON co.con_id = c.con_id

            LEFT JOIN tb_usuario u
                ON u.usu_id = c.usu_id

            LEFT JOIN tb_assembleia a
                ON a.ass_id = p.ass_id

            WHERE co.con_id = ?

            ORDER BY
                p.pag_status ASC,
                c.cot_numero ASC
        `;

        const rows = await this.banco.ExecutaComando(sql, [con_id]);

        return rows;
    }

    async contarTotalCotas(con_id) {

        const sql = `
            SELECT COUNT(*) as total
            FROM tb_cota
            WHERE con_id = ?`;

        const rows = await this.banco.ExecutaComando(sql, [con_id]);

        return rows[0].total;
    }

    async atualizarStatus(conId, novoStatus) {
        const sql = "UPDATE tb_consorcio SET con_status = ? WHERE con_id = ?";
        const result = await this.banco.ExecutaComandoNonQuery(sql, [novoStatus, conId]);
        return result;
    }

    
}
