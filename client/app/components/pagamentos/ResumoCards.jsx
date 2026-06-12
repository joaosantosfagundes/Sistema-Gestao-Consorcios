// Recebe os totais já calculados e a função de realizar assembleia
export default function ResumoCards({ confirmados, pendentes, totalArrecadado, podeRealizar, realizando, onRealizar }) {
    return (
        <div className="row mb-4">
            <div className="col-md-3">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Confirmados</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{confirmados}</div>
                            </div>
                            <div className="col-auto"><i className="fas fa-check-circle fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-3">
                <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Pendentes</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{pendentes}</div>
                            </div>
                            <div className="col-auto"><i className="fas fa-clock fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-3">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Arrecadado</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    R$ {totalArrecadado.toFixed(2)}
                                </div>
                            </div>
                            <div className="col-auto"><i className="fas fa-dollar-sign fa-2x text-gray-300"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botão assembleia — só aparece quando todas as cotas do mês pagaram */}
            <div className="col-md-3">
                <div className={`card shadow h-100 py-2 ${podeRealizar ? "border-left-success" : "border-left-secondary"}`}>
                    <div className="card-body d-flex align-items-center justify-content-center">
                        {podeRealizar ? (
                            <button
                                className="btn btn-success btn-block"
                                disabled={realizando}
                                onClick={onRealizar}
                            >
                                {realizando
                                    ? <><span className="spinner-border spinner-border-sm mr-2" />Sorteando...</>
                                    : <><i className="fas fa-gavel mr-2"></i>Realizar Assembleia</>
                                }
                            </button>
                        ) : (
                            <div className="text-center">
                                <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">Assembleia</div>
                                <small className="text-muted">
                                    <i className="fas fa-lock mr-1"></i>
                                    {pendentes > 0
                                        ? `Aguardando ${pendentes} pagamento(s)`
                                        : "Já realizada este mês"
                                    }
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
