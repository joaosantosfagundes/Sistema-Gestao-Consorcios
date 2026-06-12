import { moeda } from "@/utils/formatString";

export default function SaldoCards({ saldoCon, saldoAdm, loadingCon }) {
    const valCon = Number(saldoCon?.valor ?? saldoCon?.saldo ?? 0);
    const valAdm = Number(saldoAdm?.valor ?? saldoAdm?.saldo ?? 0);

    return (
        <div className="row mb-4">
            <div className="col-xl-6 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Saldo do Consórcio
                                </div>
                                <div className="h4 mb-0 font-weight-bold text-gray-800">
                                    {loadingCon
                                        ? <span className="spinner-border spinner-border-sm" />
                                        : moeda(valCon)
                                    }
                                </div>
                                <small className="text-muted">Fundo coletivo acumulado</small>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-piggy-bank fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-6 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Meu Saldo (Taxa de Administração)
                                </div>
                                <div className="h4 mb-0 font-weight-bold text-gray-800">
                                    {moeda(valAdm)}
                                </div>
                                <small className="text-muted">Receita acumulada das taxas</small>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-wallet fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
