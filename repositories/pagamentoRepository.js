import Repository from "./repository.js";

export default class PagamentoRepository extends Repository {
    constructor() {
        super();
        
    }

    async inserir(pagamento) {
        let campos = ['cot_id', 'pag_valor', 'pag_status'];
        let valores = [pagamento.cot_id, pagamento.pag_valor, pagamento.pag_status];
        let placeholders = '?, ?, ?';
        
        if (pagamento.pag_datageracao) {
            campos.push('pag_datageracao');
            valores.push(pagamento.pag_datageracao);
            placeholders += ', ?';
        }
        
        const sql = `INSERT INTO tb_pagamento (${campos.join(', ')}) VALUES (${placeholders})`;
        const id = await this.banco.ExecutaComandoLastInserted(sql, valores);

        return { id, ...pagamento };
    }

    async criarPagamentoSimples(pagamento) {
        return await this.inserir(pagamento);
    }

    async listarTodos() {
        const rows = await this.banco.ExecutaComando("SELECT * FROM tb_pagamento", []);
        return rows;
    }

    async buscarPorId(id) {
        const rows = await this.banco.ExecutaComando(
            "SELECT * FROM tb_pagamento WHERE pag_id = ?",
            [id]
        );
        return rows[0];
    }

    async buscarPorCota(cot_id) {
        const rows = await this.banco.ExecutaComando(
            "SELECT * FROM tb_pagamento WHERE cot_id = ?",
            [cot_id]
        );
        return rows;
    }

    async atualizarStatus(id, status) {
        const sql = status === 'CONFIRMADO'
            ? "UPDATE tb_pagamento SET pag_status = ?, pag_datapagamento = NOW() WHERE pag_id = ?"
            : "UPDATE tb_pagamento SET pag_status = ? WHERE pag_id = ?";

        await this.banco.ExecutaComandoNonQuery(sql, [status, id]);
    }

    async adicionarAssembleiaAosPagamentosConfirmados(cotaId, assembliaId) {
        const sql = "UPDATE tb_pagamento SET ass_id = ? WHERE cot_id = ?";
        await this.banco.ExecutaComandoNonQuery(sql, [assembliaId, cotaId]);
    }
}