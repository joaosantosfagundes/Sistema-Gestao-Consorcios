import { formatarData, moeda } from "@/utils/formatString";

export default function HistoricoAssembleias({ assembleias }) {
    if (!assembleias || assembleias.length === 0) return null;

    const realizadas = assembleias.filter(a => a.cot_sorteada_id).length;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                    <i className="fas fa-gavel mr-1"></i> Histórico de Assembleias
                </h6>
                <span className="badge badge-secondary badge-pill">
                    {realizadas} realizadas
                </span>
            </div>
            <div className="card-body">
                <div className="table-responsive rounded border overflow-hidden">
                    <table className="table table-hover mb-0">
                        <thead className="thead-light">
                            <tr>
                                <th>#</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Cota Contemplada</th>
                                <th>Contemplado</th>
                                <th>Prêmio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assembleias.map(a => (
                                <tr key={a.ass_id}>
                                    <td><strong>{a.ass_numero}</strong></td>
                                    <td>{formatarData(a.ass_data)}</td>
                                    <td>
                                        {a.cot_sorteada_id
                                            ? <span className="badge badge-success">✓ Realizada</span>
                                            : <span className="badge badge-secondary">Pendente</span>
                                        }
                                    </td>
                                    <td>
                                        {a.cot_sorteada_id
                                            ? <span className="text-success"><i className="fas fa-ticket-alt mr-1"></i>Cota #{a.cot_sorteada_numero}</span>
                                            : <span className="text-muted">—</span>
                                        }
                                    </td>
                                    <td>{a.contemplado_nome || <span className="text-muted">—</span>}</td>
                                    <td>
                                        {a.cot_sorteada_id
                                            ? <strong className="text-success">+ {moeda(a.ass_premio)}</strong>
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
