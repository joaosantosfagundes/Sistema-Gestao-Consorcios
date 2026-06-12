export function formatarData(valor) {
    if (!valor) return "—";

    if (typeof valor === "string") {
        // Formato ISO com T: "2026-05-30T01:08:54.000Z"
        if (valor.includes("T")) {
            const d = new Date(valor);
            return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
        }
        // Formato mysql dateStrings: "2026-05-30 01:08:54"
        const [ano, mes, dia] = valor.split(" ")[0].split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // objeto Date direto
    return new Date(valor).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function moeda(valor) {
    return `R$ ${Number(valor || 0).toFixed(2)}`;
}
