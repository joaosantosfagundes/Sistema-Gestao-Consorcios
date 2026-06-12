'use client'
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import UserContext from "@/app/context/userContext";
import ApiClient from "@/utils/apiClient";
import Loading from "@/app/components/loading";
import ModalPix from "@/app/components/cotas/ModalPix";
import ResumoCards from "@/app/components/cotas/ResumoCards";
import CotasDisponiveis from "@/app/components/cotas/CotasDisponiveis";
import MinhasCotas from "@/app/components/cotas/MinhasCotas";
import HistoricoAssembleias from "@/app/components/pagamentos/HistoricoAssembleias";

export default function CotasConsorcio() {
    const { id: consorcioId } = useParams();
    const { usuario } = useContext(UserContext);

    const [cotasDisponiveis, setCotasDisponiveis]   = useState([]);
    const [minhasCotas, setMinhasCotas]             = useState([]);
    const [pagamentosPorCota, setPagamentosPorCota] = useState({});
    const [assembleias, setAssembleias]             = useState([]);
    const [loading, setLoading]                     = useState(true);
    const [comprando, setComprando]                 = useState(null);
    const [gerandoPix, setGerandoPix]               = useState(null);
    const [pixAtual, setPixAtual]                   = useState(null);

    const socketRef = useRef(null);

    // ── Socket (import dinâmico para evitar erro de SSR no Next.js) ───────────
    useEffect(() => {
        if (!usuario) return;

        let socket;

        // import() dinâmico = só roda no browser, nunca no servidor
        import('socket.io-client').then(({ io }) => {
            socket = io("http://localhost:5000", { withCredentials: true });
            socketRef.current = socket;

            socket.on("connect", () => {
                console.log("Socket conectado:", socket.id);
            });

            // Webhook confirmou pagamento → atualiza lista sem reload
            socket.on("pagamento:confirmado", () => {
                carregarMinhasCotas();
                toast.success("Parcela confirmada!", { id: "pag-confirmado" });
            });
        });

        return () => { socket?.disconnect(); };
    }, [usuario]);

    function entrarNaSalaDaCota(cotaId) {
        socketRef.current?.emit("notificacoes:conectar", cotaId);
    }

    // ── Fetch ─────────────────────────────────────────────────────────────────

    async function carregar() {
        setLoading(true);
        try {
            await Promise.all([carregarDisponiveis(), carregarMinhasCotas(), carregarAssembleias()]);
        } finally {
            setLoading(false);
        }
    }

    async function carregarDisponiveis() {
        const data = await ApiClient.get(`cota/disponiveis/${consorcioId}`);
        if (data) setCotasDisponiveis(data);
    }

    async function carregarMinhasCotas() {
        if (!usuario) return;
        const todas = await ApiClient.get(`cota/usuario/${usuario.id}`);
        if (!todas) return;

        const doConsorcio = todas.filter(c => String(c.con_id) === String(consorcioId));
        setMinhasCotas(doConsorcio);

        const mapa = {};
        await Promise.all(doConsorcio.map(async (cota) => {
            const pags = await ApiClient.get(`pagamento/cota/${cota.cot_id}`);
            mapa[cota.cot_id] = Array.isArray(pags) ? pags : [];
        }));
        setPagamentosPorCota(mapa);
    }

    async function carregarAssembleias() {
        const data = await ApiClient.get(`assembleia/${consorcioId}`);
        setAssembleias(Array.isArray(data) ? data : []);
    }

    useEffect(() => { carregar(); }, [consorcioId, usuario]);

    // ── Ações ─────────────────────────────────────────────────────────────────

    async function comprarCota(cotaId) {
        if (!usuario) { toast.error("Você precisa estar logado!"); return; }
        setComprando(cotaId);
        const toastId = toast.loading("Comprando cota e gerando PIX...");
        try {
            const corpo = await ApiClient.post("cota", { cotaID: cotaId, usuarioId: usuario.id });
            toast.dismiss(toastId);

            if (corpo && !corpo.error) {
                toast.success("Cota comprada! Pague a 1ª parcela pelo PIX abaixo.");
                // Entra na sala do socket para receber confirmação em tempo real
                entrarNaSalaDaCota(cotaId);
                // Abre o modal imediatamente — pagamentos carregam via socket ou ao fechar
                setPixAtual(corpo);
                // Só atualiza disponíveis (remove a cota do grid)
                carregarDisponiveis();
            } else {
                toast.error(corpo.error || "Erro ao comprar cota");
            }
        } catch {
            toast.dismiss(toastId);
            toast.error("Erro de conexão");
        } finally {
            setComprando(null);
        }
    }

    async function gerarPix(cotaId, valor, pagId) {
        setGerandoPix(pagId);
        entrarNaSalaDaCota(cotaId);
        const toastId = toast.loading("Gerando PIX...");
        try {
            const data = await ApiClient.post("pagamento/pix", { cot_id: cotaId, valor });
            toast.dismiss(toastId);
            if (data?.qrCode) setPixAtual(data);
            else toast.error(data?.msg || "Erro ao gerar PIX");
        } catch {
            toast.dismiss(toastId);
            toast.error("Erro de conexão");
        } finally {
            setGerandoPix(null);
        }
    }

    async function fecharModal() {
        setPixAtual(null);
        await carregar(); // recarrega tudo ao fechar
    }

    // ── Totais ────────────────────────────────────────────────────────────────

    const confirmados     = Object.values(pagamentosPorCota).flat().filter(p => p.pag_status === "CONFIRMADO").length;
    const totalPagamentos = Object.values(pagamentosPorCota).flat().length;

    if (loading) return <Loading />;

    return (
        <>
            <ModalPix pixAtual={pixAtual} onFechar={fecharModal} />

            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">
                    <i className="fas fa-ticket-alt text-primary mr-2"></i>
                    Cotas e Pagamentos
                </h1>
                <button className="btn btn-sm btn-outline-secondary" onClick={carregar}>
                    <i className="fas fa-sync-alt mr-1"></i> Atualizar
                </button>
            </div>

            <ResumoCards
                disponiveis={cotasDisponiveis.length}
                minhasCotas={minhasCotas.length}
                confirmados={confirmados}
                totalPagamentos={totalPagamentos}
            />

            <CotasDisponiveis
                cotas={cotasDisponiveis}
                comprando={comprando}
                onComprar={comprarCota}
            />
            
            <HistoricoAssembleias assembleias={assembleias} />

            <MinhasCotas
                cotas={minhasCotas}
                pagamentosPorCota={pagamentosPorCota}
                gerandoPix={gerandoPix}
                onGerarPix={gerarPix}
            />
        </>
    );
}
