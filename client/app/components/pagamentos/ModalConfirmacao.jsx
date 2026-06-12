//assembleia


export default function ModalConfirmacao({ titulo, mensagem, subtexto, onConfirmar, onCancelar, carregando }) {
    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1050,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)'
                }}
            >
                <div
                    className="card shadow-lg"
                    style={{ maxWidth: 440, width: '90%', borderRadius: 12, overflow: 'hidden' }}
                >
                    {/* Header */}
                    <div className="card-header bg-success text-white py-3 px-4 d-flex align-items-center" style={{ gap: 10 }}>
                        <i className="fas fa-gavel fa-lg"></i>
                        <h5 className="mb-0">{titulo}</h5>
                    </div>

                    {/* Body */}
                    <div className="card-body px-4 py-4">
                        <p className="text-gray-700 mb-2" style={{ fontSize: 15 }}>{mensagem}</p>
                        {subtexto && (
                            <div className="alert alert-info py-2 px-3 mb-0" style={{ fontSize: 13, borderRadius: 8 }}>
                                <i className="fas fa-info-circle mr-1"></i>
                                {subtexto}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="card-footer bg-white px-4 py-3 d-flex justify-content-end" style={{ gap: 8 }}>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={onCancelar}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={onConfirmar}
                            disabled={carregando}
                            style={{ minWidth: 140 }}
                        >
                            {carregando
                                ? <><span className="spinner-border spinner-border-sm mr-2" />Sorteando...</>
                                : <><i className="fas fa-random mr-2"></i>Confirmar Sorteio</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
