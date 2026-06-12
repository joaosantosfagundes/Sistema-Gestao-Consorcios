'use client'
import { useState } from "react";
import toast from "react-hot-toast";

function buildImgSrc(qrCode) {
    if (!qrCode) return null;
    if (qrCode.startsWith("data:")) return qrCode;
    return `data:image/png;base64,${qrCode}`;
}

export default function ModalPix({ pixAtual, onFechar }) {
    const [simulando, setSimulando]   = useState(false);
    const [confirmado, setConfirmado] = useState(false);

    if (!pixAtual) return null;

    const imgSrc = buildImgSrc(pixAtual.qrCode);

    async function simular() {
        if (simulando) return;
        setSimulando(true);
        try {
            await fetch("http://localhost:5000/pagamento/simular", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pixId: pixAtual.pixId })
            });
            // O socket em page.jsx vai detectar o pagamento:confirmado e atualizar a lista.
            // Aqui só mostramos o estado visual de confirmação.
            setConfirmado(true);
            toast.success("Pagamento confirmado!");
        } catch {
            toast.error("Erro ao simular pagamento");
        } finally {
            setSimulando(false);
        }
    }

    return (
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
            <div className="modal fade show" style={{ display: "block", zIndex: 1050 }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg">

                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">
                                <i className="fas fa-qrcode mr-2"></i>
                                Pagar via PIX
                            </h5>
                            <button className="close text-white" onClick={onFechar} disabled={simulando}>
                                <span>&times;</span>
                            </button>
                        </div>

                        <div className="modal-body text-center py-4">
                            {confirmado ? (
                                <div className="py-2">
                                    <div style={{ fontSize: 56 }}>✅</div>
                                    <h5 className="text-success mt-3 font-weight-bold">Pagamento Confirmado!</h5>
                                    <p className="text-muted small">Feche para atualizar os dados.</p>
                                </div>
                            ) : (
                                <>
                                    {imgSrc ? (
                                        <img
                                            src={imgSrc}
                                            alt="QR Code PIX"
                                            className="mb-3 border rounded p-2"
                                            style={{ width: 200, height: 200, objectFit: "contain" }}
                                        />
                                    ) : (
                                        <div className="mb-3 text-muted">
                                            <i className="fas fa-qrcode fa-4x"></i>
                                            <p className="small mt-2">QR Code não disponível</p>
                                        </div>
                                    )}

                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            readOnly
                                            value={pixAtual.copiaCola || ""}
                                            style={{ fontSize: "0.7rem" }}
                                        />
                                        <div className="input-group-append">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixAtual.copiaCola || "");
                                                    toast.success("Código copiado!");
                                                }}
                                            >
                                                <i className="fas fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <small className="text-muted d-block mb-3">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        A confirmação é automática após o pagamento.
                                    </small>

                                    <hr />
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={simular}
                                        disabled={simulando}
                                    >
                                        {simulando
                                            ? <><span className="spinner-border spinner-border-sm mr-2" />Confirmando...</>
                                            : <><i className="fas fa-play mr-1" />Simular Pagamento</>
                                        }
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className={`btn btn-sm ${confirmado ? "btn-success" : "btn-secondary"}`}
                                onClick={onFechar}
                                disabled={simulando}
                            >
                                {confirmado ? <><i className="fas fa-check mr-1" />Fechar e atualizar</> : "Fechar"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
