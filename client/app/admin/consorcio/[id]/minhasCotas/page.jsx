'use client'
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import UserContext from "@/app/context/userContext";
import ApiClient from "@/utils/apiClient";
import Loading from "@/app/components/loading";
import ModalPix from "@/app/components/cotas/ModalPix";
import MinhasCotas from "@/app/components/cotas/MinhasCotas";

export default function MinhasCotasConsorcio() {
    const { id: consorcioId } = useParams();
    const { usuario }         = useContext(UserContext);

    const [minhasCotas,      setMinhasCotas]      = useState([]);
    const [pagamentosPorCota, setPagamentosPorCota] = useState({});
    const [nomeConsorcio,    setNomeConsorcio]    = useState("");
    const [loading,          setLoading]          = useState(true);
    const [gerandoPix,       setGerandoPix]       = useState(null);
    const [pixAtual,         setPixAtual]         = useState(null);

    const socketRef = useRef(null);

    // ── Socket ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!usuario) return;
        let socket;
        import("socket.io-client").then(({ io }) => {
            socket = io("http://localhost:5000", { withCredentials: true });
            socketRef.current = socket;
            socket.on("pagamento:confirmado", () => {
                carregarMinhasCotas();
                toast.success("Parcela confirmada!", { id: "pag-confirmado" });
            });
        });
        return () => socket?.disconnect();
    }, [usuario]);

    function entrarNaSalaDaCota(cotaId) {
        socketRef.current?.emit("notificacoes:conectar", cotaId);
    }

    // ── Carregar cotas e pagamentos ───────────────────────────────────────
    async function carregarMinhasCotas() {
        if (!usuario) return;
        try {
            const todas = await ApiClient.get(`cota/usuario/${usuario.id}`);
            if (!todas) return;

            const doConsorcio = todas.filter(c => String(c.con_id) === String(consorcioId));
            setMinhasCotas(doConsorcio);

            if (doConsorcio.length > 0) setNomeConsorcio(doConsorcio[0].con_nome || "");

            const mapa = {};
            await Promise.all(doConsorcio.map(async (cota) => {
                const pags = await ApiClient.get(`pagamento/cota/${cota.cot_id}`);
                mapa[cota.cot_id] = Array.isArray(pags) ? pags : [];
            }));
            setPagamentosPorCota(mapa);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { carregarMinhasCotas(); }, [consorcioId, usuario]);

    // ── Gerar PIX ─────────────────────────────────────────────────────────
    async function gerarPix(cotaId, valor, pagId) {
        setGerandoPix(pagId);
        entrarNaSalaDaCota(cotaId);
        const toastId = toast.loading("Gerando PIX...");
        try {
            const data = await ApiClient.post("pagamento/pix", { cot_id: cotaId, valor });
            toast.dismiss(toastId);
            if (data) setPixAtual(data);
            else toast.error("Erro ao gerar PIX");
        } catch {
            toast.dismiss(toastId);
            toast.error("Erro de conexão");
        } finally {
            setGerandoPix(null);
        }
    }

    async function fecharModal() {
        setPixAtual(null);
        await carregarMinhasCotas();
    }

    if (loading) return <Loading />;

    return (
        <>
            <ModalPix pixAtual={pixAtual} onFechar={fecharModal} />

            {/* Cabeçalho */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="h3 mb-0 text-gray-800">
                        <i className="fas fa-receipt text-primary mr-2"></i>
                        Minhas Parcelas
                    </h1>
                    {nomeConsorcio && <small className="text-muted">{nomeConsorcio}</small>}
                </div>
                <div className="d-flex" style={{ gap: 8 }}>
                    <button className="btn btn-sm btn-outline-secondary" onClick={carregarMinhasCotas}>
                        <i className="fas fa-sync-alt mr-1"></i> Atualizar
                    </button>
                    <Link href="/admin/cota/minhasCotas" className="btn btn-sm btn-outline-secondary">
                        <i className="fas fa-arrow-left mr-1"></i> Voltar
                    </Link>
                </div>
            </div>

            {/* Sem cotas neste consórcio */}
            {minhasCotas.length === 0 ? (
                <div className="card shadow">
                    <div className="card-body text-center py-5">
                        <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                        <h5 className="text-gray-500">Você não possui cotas neste consórcio.</h5>
                        <Link href="/admin/consorcio" className="btn btn-primary mt-2">
                            Ver Consórcios Disponíveis
                        </Link>
                    </div>
                </div>
            ) : (
                <MinhasCotas
                    cotas={minhasCotas}
                    pagamentosPorCota={pagamentosPorCota}
                    gerandoPix={gerandoPix}
                    onGerarPix={gerarPix}
                />
            )}
        </>
    );
}
