import { formatarData, moeda } from "@/utils/formatString";
import BadgeTipo from "./BadgeTipo";

export default function MovimentacoesConsorcio({ consorcios, conSelecionado, onChangeCon, movCon, loading }) {
    const totalEntrada = movCon.reduce((acc, m) => acc + (m.tipo === "ENTRADA" ? Number(m.valor) : 0), 0);
    const totalSaida   = movCon.reduce((acc, m) => acc + (m.tipo === "SAIDA"   ? Number(m.valor) : 0), 0);

    return (
        <div>
            {/* Select + totais */}
            <div className="card shadow mb-3">
                <div className="card-body py-3">
                    <div className="form-inline" style={{ gap: 12 }}>
                        <label className="font-weight-bold mr-2 text-gray-700">
                            <i className="fas fa-filter mr-1"></i>Consórcio:
                        </label>
                        <select
                            className="form-control form-control-sm"
                            value={conSelecionado}
                            onChange={e => onChangeCon(e.target.value)}
                            style={{ minWidth: 220 }}
                        >
                            {consorcios.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>

                        {!loading && movCon.length > 0 && (
                            <div className="ml-auto d-flex" style={{ gap: 12 }}>
                                <span className="badge badge-success p-2">
                                    <i className="fas fa-arrow-up mr-1"></i>
                                    Entradas: {moeda(totalEntrada)}
                                </span>
                                <span className="badge badge-danger p-2">
                                    <i className="fas fa-arrow-down mr-1"></i>
                                    Saídas: {moeda(totalSaida)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Histórico de Movimentações</h6>
                    <span className="badge badge-primary badge-pill">{movCon.length} registros</span>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : movCon.length === 0 ? (
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
                                        <th>Origem / Destino</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movCon.map((m, i) => (
                                        <tr key={m.id ?? i}>
                                            <td>{m.id}</td>
                                            <td><BadgeTipo tipo={m.tipo} /></td>
                                            <td>
                                                <strong className={m.tipo === "ENTRADA" ? "text-success" : "text-danger"}>
                                                    {m.tipo === "SAIDA" ? "– " : "+ "}{moeda(m.valor)}
                                                </strong>
                                            </td>
                                            <td>{formatarData(m.data)}</td>
                                            <td>
                                                {m.tipo === "SAIDA" ? (
                                                    // Saída = prêmio da assembleia — mostra quem recebeu
                                                    m.contemplado_nome ? (
                                                        <span>
                                                            <i className="fas fa-trophy text-warning mr-1"></i>
                                                            <strong>{m.contemplado_nome}</strong>
                                                            {m.cota_contemplada && (
                                                                <small className="text-muted ml-1">(Cota #{m.cota_contemplada})</small>
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted">
                                                            <i className="fas fa-gavel mr-1"></i>
                                                            Assembleia #{m.assembleia_numero || "—"}
                                                        </span>
                                                    )
                                                ) : (
                                                    // Entrada = pagamento de parcela
                                                    m.pagamentoId
                                                        ? <span className="badge badge-secondary">Pag #{m.pagamentoId}</span>
                                                        : "—"
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
        </div>
    );
}
