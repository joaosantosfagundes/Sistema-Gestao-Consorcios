import { formatarData } from "@/utils/formatString";
function badgePagamento(status) {
    if (status === "CONFIRMADO") return "badge-success";
    if (status === "PENDENTE")   return "badge-warning";
    return "badge-secondary";
}

function badgeCota(status) {
    if (status === "REGULAR")     return "badge-success";
    if (status === "CONTEMPLADA") return "badge-warning";
    if (status === "INADIMPLEMTE") return "badge-danger";
    return "badge-secondary";
}

function verificarStatusCota(cotaStatus, pagamentos) {
    if (cotaStatus === "CONTEMPLADA") return "CONTEMPLADA";
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const temInadimplencia = pagamentos.some(pag => {
        if (pag.pag_status === "CONFIRMADO") return false;
        
        const dataVenc = new Date(pag.pag_datageracao);
        dataVenc.setHours(0, 0, 0, 0);
        
        return hoje > dataVenc;
    });
    
    return temInadimplencia ? "INADIMPLEMTE" : "REGULAR";
}

export default function MinhasCotas({ cotas, pagamentosPorCota, gerandoPix, onGerarPix }) {
    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-success">
                    Minhas Cotas neste Consórcio
                </h6>
                <span className="badge badge-success badge-pill">
                    {cotas.length} cota{cotas.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="card-body">
                {cotas.length === 0 ? (
                    <div className="text-center py-3 text-muted">
                        <i className="fas fa-inbox fa-2x mb-2"></i>
                        <p className="mb-0">Você ainda não possui cotas neste consórcio.</p>
                    </div>
                ) : (
                    cotas.map((cota) => {
                        const pags  = pagamentosPorCota[cota.cot_id] || [];
                        const pagas = pags.filter(p => p.pag_status === "CONFIRMADO").length;

                        return (
                            <div key={cota.cot_id} className="card border mb-3">
                                {/* Header da cota */}
                                <div className="card-header bg-light d-flex align-items-center justify-content-between py-2">
                                    <div>
                                        <strong>Cota #{cota.cot_numero}</strong>
                                        <span className={`badge ml-2 ${badgeCota(verificarStatusCota(cota.cot_status, pags))}`}>
                                            {verificarStatusCota(cota.cot_status, pags)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <small className="text-muted">{pagas}/{pags.length} parcelas pagas</small>
                                        <div className="progress mt-1" style={{ height: 6, width: 120 }}>
                                            <div
                                                className="progress-bar bg-success"
                                                style={{
                                                    width: pags.length > 0
                                                        ? `${(pagas / pags.length) * 100}%`
                                                        : "0%"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tabela de parcelas */}
                                <div className="card-body p-0">
                                    {pags.length === 0 ? (
                                        <p className="text-muted small p-3 mb-0">
                                            Nenhum pagamento encontrado para esta cota.
                                        </p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-sm table-hover mb-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th className="pl-3">Parcela</th>
                                                        <th>Vencimento</th>
                                                        <th>Valor</th>
                                                        <th>Status</th>
                                                        <th>Ação</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pags.map((pag, i) => (
                                                        <tr key={pag.pag_id}>
                                                            <td className="pl-3">{i + 1}ª</td>
                                                            <td>
                                                                {pag.pag_datageracao
                                                                    ? formatarData(pag.pag_datageracao)
                                                                    : "—"}
                                                            </td>
                                                            <td>
                                                                <strong>R$ {Number(pag.pag_valor).toFixed(2)}</strong>
                                                            </td>
                                                            <td>
                                                                <span className={`badge ${badgePagamento(pag.pag_status)}`}>
                                                                    {pag.pag_status === "CONFIRMADO" ? "✓ Pago" : "Pendente"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {pag.pag_status === "PENDENTE" ? (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        disabled={gerandoPix === pag.pag_id}
                                                                        onClick={() => onGerarPix(cota.cot_id, pag.pag_valor, pag.pag_id)}
                                                                    >
                                                                        {gerandoPix === pag.pag_id
                                                                            ? <i className="fas fa-spinner fa-spin"></i>
                                                                            : <><i className="fas fa-qrcode mr-1"></i>Pagar PIX</>
                                                                        }
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-success small">
                                                                        <i className="fas fa-check mr-1"></i>Confirmado
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
