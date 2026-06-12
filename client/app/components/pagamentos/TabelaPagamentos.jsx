import Link from "next/link";
import { formatarData } from "@/utils/formatString";

function badgeStatus(status) {
    if (status === "CONFIRMADO") return "badge-success";
    if (status === "PENDENTE")   return "badge-warning";
    return "badge-secondary";
}

export default function TabelaPagamentos({ lista }) {
    if (lista.length === 0) {
        return (
            <div className="card shadow mb-4">
                <div className="card-body text-center py-5">
                    <i className="fas fa-inbox fa-3x text-gray-300 mb-3"></i>
                    <h5 className="text-gray-500">Nenhum pagamento encontrado para este consórcio.</h5>
                    <Link href="/admin/consorcio/meusConsorcios" className="btn btn-primary mt-2">
                        Voltar aos Consórcios
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Todos os Pagamentos</h6>
                <span className="badge badge-primary badge-pill">{lista.length} registros</span>
            </div>
            <div className="card-body">
                <div className="table-responsive rounded border overflow-hidden">
                    <table className="table table-hover mb-0" width="100%" cellSpacing="0">
                        <thead className="thead-light">
                            <tr>
                                <th>#</th>
                                <th>Cota</th>
                                <th>Participante</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Vencimento</th>
                                <th>Pago em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((p) => (
                                <tr key={p.pag_id}>
                                    <td><strong>{p.pag_id}</strong></td>
                                    <td><span className="badge badge-info">Cota #{p.cot_numero}</span></td>
                                    <td>
                                        {p.usu_nome
                                            ? <><i className="fas fa-user fa-sm mr-1 text-gray-400"></i>{p.usu_nome}</>
                                            : <span className="text-muted">—</span>
                                        }
                                    </td>
                                    <td><strong>R$ {Number(p.pag_valor).toFixed(2)}</strong></td>
                                    <td>
                                        <span className={`badge ${badgeStatus(p.pag_status)}`}>
                                            {p.pag_status === "CONFIRMADO" ? "✓ Confirmado" : "Pendente"}
                                        </span>
                                    </td>
                                    <td>{formatarData(p.pag_datageracao)}</td>
                                    <td>
                                        {p.pag_datapagamento
                                            ? <span className="text-success">{formatarData(p.pag_datapagamento)}</span>
                                            : <span className="text-muted">—</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
