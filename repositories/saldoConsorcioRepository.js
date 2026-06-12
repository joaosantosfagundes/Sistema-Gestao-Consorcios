import Repository from "./repository.js";
import SaldoConsorcioEntity from "../entities/saldoEntity.js";

export default class SaldoConsorcioRepository extends Repository {

    constructor() {
        super();
    }

    async buscarPorConsorcio(consorcioId) {
        const rows = await this.banco.ExecutaComando(
            "SELECT * FROM tb_saldoconsorcio WHERE con_id = ?",
            [consorcioId]
        );
        return rows[0] ? SaldoConsorcioEntity.toMap(rows[0]) : null;
    }

    // Soma valor ao saldo (entrada de pagamento)
    async acumular(consorcioId, valor) {
        const existe = await this.banco.ExecutaComando(
            "SELECT sal_id FROM tb_saldoconsorcio WHERE con_id = ?",
            [consorcioId]
        );

        if (existe.length > 0) {
            return await this.banco.ExecutaComandoNonQuery(
                "UPDATE tb_saldoconsorcio SET sal_valor = sal_valor + ?, sal_dataatualizacao = NOW() WHERE con_id = ?",
                [valor, consorcioId]
            );
        }

        return await this.banco.ExecutaComandoNonQuery(
            "INSERT INTO tb_saldoconsorcio (con_id, sal_valor, sal_dataatualizacao) VALUES (?, ?, NOW())",
            [consorcioId, valor]
        );
    }

    // Subtrai valor do saldo (débito do prêmio ao realizar assembleia)
    async debitar(consorcioId, valor) {
        return await this.banco.ExecutaComandoNonQuery(
            "UPDATE tb_saldoconsorcio SET sal_valor = sal_valor - ?, sal_dataatualizacao = NOW() WHERE con_id = ?",
            [valor, consorcioId]
        );
    }
}
