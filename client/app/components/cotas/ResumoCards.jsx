export default function ResumoCards({ disponiveis, minhasCotas, confirmados, totalPagamentos }) {
    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Cotas Disponíveis
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {disponiveis}
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-tags fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Minhas Cotas
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {minhasCotas}
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-ticket-alt fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                    Parcelas Pagas
                                </div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                    {confirmados} / {totalPagamentos}
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
