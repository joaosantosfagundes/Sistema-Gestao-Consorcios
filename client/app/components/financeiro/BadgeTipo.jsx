const CFG = {
    ENTRADA: { cls: "badge-success", icon: "fa-arrow-up",     txt: "Entrada" },
    SAIDA:   { cls: "badge-danger",  icon: "fa-arrow-down",   txt: "Saída"   },
    CREDITO: { cls: "badge-primary", icon: "fa-plus-circle",  txt: "Crédito" },
    SAQUE:   { cls: "badge-warning", icon: "fa-minus-circle", txt: "Saque"   },
};

export default function BadgeTipo({ tipo }) {
    if (!tipo) return null;
    const c = CFG[tipo] || { cls: "badge-secondary", icon: "fa-circle", txt: tipo };
    return (
        <span className={`badge ${c.cls}`}>
            <i className={`fas ${c.icon} mr-1`}></i>{c.txt}
        </span>
    );
}
