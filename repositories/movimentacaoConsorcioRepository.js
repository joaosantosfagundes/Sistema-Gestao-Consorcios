import Repository from "./repository.js";
import MovimentacaoConsorcioEntity from "../entities/movimentacaoEntity.js";

export default class MovimentacaoConsorcioRepository extends Repository {

    constructor() {
        super();
    }

    async listarPorConsorcio(consorcioId) {
        // JOIN para trazer o nome do contemplado nas saídas (prêmio de assembleia)
        const sql = `
            SELECT
                m.mov_id       AS id,
                m.mov_tipo     AS tipo,
                m.mov_valor    AS valor,
                m.mov_data     AS data,
                m.pag_id       AS pagamentoId,
                m.ass_id       AS assembleiaId,
                a.ass_numero   AS assembleia_numero,
                u.usu_nome     AS contemplado_nome,
                ct.cot_numero  AS cota_contemplada
            FROM tb_movimentacaoconsorcio m
            LEFT JOIN tb_assembleia a  ON a.ass_id  = m.ass_id
            LEFT JOIN tb_cota       ct ON ct.cot_id = a.cot_id
            LEFT JOIN tb_usuario    u  ON u.usu_id  = ct.usu_id
            WHERE m.con_id = ?
            ORDER BY m.mov_data DESC
        `;
        return await this.banco.ExecutaComando(sql, [consorcioId]);
    }

    // Entrada — chamado quando pagamento é confirmado
    async inserir(consorcioId, pagamentoId, valor) {
        return await this.banco.ExecutaComandoNonQuery(
            "INSERT INTO tb_movimentacaoconsorcio (con_id, pag_id, mov_tipo, mov_valor, mov_data) VALUES (?, ?, 'ENTRADA', ?, NOW())",
            [consorcioId, pagamentoId, valor]
        );
    }

    // Saída — chamado quando assembleia é realizada e prêmio é debitado
    async inserirSaida(consorcioId, assId, valor) {
        return await this.banco.ExecutaComandoNonQuery(
            "INSERT INTO tb_movimentacaoconsorcio (con_id, ass_id, mov_tipo, mov_valor, mov_data) VALUES (?, ?, 'SAIDA', ?, NOW())",
            [consorcioId, assId, valor]
        );
    }
}
