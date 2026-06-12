import { formatarData, moeda } from "@/utils/formatString";
import BadgeTipo from "./BadgeTipo";

export default function MovimentacoesAdmin({ movAdm }) {
    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                    Minhas Movimentações (Taxa de Administração)
                </h6>
                <span className="badge badge-primary badge-pill">{movAdm.length} registros</span>
            </div>
            <div className="card-body">
                {movAdm.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-inbox fa-3x text-gray-300 mb-3"></i>
                        <h5 className="text-gray-500">Nenhuma movimentação ainda.</h5>
                        <small className="text-muted">Aparece conforme os pagamentos forem confirmados.</small>
                    </div>
                ) : (
                    <div className="table-responsive rounded border overflow-hidden">
                        <table className="table table-hover mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                    <th>Consórcio</th>
                                    <th>Pagamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movAdm.map((m, i) => (
                                    <tr key={m.id ?? i}>
                                        <td>{m.id}</td>
                                        <td><BadgeTipo tipo={m.tipo} /></td>
                                        <td>
                                            <strong className="text-primary">+ {moeda(m.valor)}</strong>
                                        </td>
                                        <td>{formatarData(m.data)}</td>
                                        <td>
                                            {m.consorcioId
                                                ? <span className="badge badge-secondary">Con #{m.consorcioId}</span>
                                                : "—"
                                            }
                                        </td>
                                        <td>
                                            {m.pagamentoId
                                                ? <span className="badge badge-secondary">Pag #{m.pagamentoId}</span>
                                                : "—"
                                            }
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
}
