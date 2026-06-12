export default function CotasDisponiveis({ cotas, comprando, onComprar }) {
    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                    Cotas Disponíveis para Compra
                </h6>
                <span className="badge badge-primary badge-pill">
                    {cotas.length} disponíveis
                </span>
            </div>

            <div className="card-body">
                {cotas.length === 0 ? (
                    <div className="text-center py-3 text-muted">
                        <i className="fas fa-check-circle fa-2x mb-2"></i>
                        <p className="mb-0">Todas as cotas já foram vendidas.</p>
                    </div>
                ) : (
                    <div className="row">
                        {cotas.map((cota) => (
                            <div key={cota.cot_id} className="col-6 col-md-3 col-lg-2 mb-3">
                                <div className="card border text-center h-100">
                                    <div className="card-body p-3">
                                        <div className="font-weight-bold text-primary mb-1">
                                            #{cota.cot_numero}
                                        </div>
                                        <span className="badge badge-primary mb-2 d-block">
                                            {cota.cot_status}
                                        </span>
                                        <button
                                            className="btn btn-success btn-sm btn-block"
                                            disabled={comprando === cota.cot_id}
                                            onClick={() => onComprar(cota.cot_id)}
                                        >
                                            {comprando === cota.cot_id
                                                ? <i className="fas fa-spinner fa-spin"></i>
                                                : <><i className="fas fa-shopping-cart mr-1"></i>Comprar</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
