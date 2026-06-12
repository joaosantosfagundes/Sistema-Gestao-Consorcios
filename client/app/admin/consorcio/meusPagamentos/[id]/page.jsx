'use client'
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import UserContext from "@/app/context/userContext";
import ResumoCards from "@/app/components/pagamentos/ResumoCards";
import TabelaPagamentos from "@/app/components/pagamentos/TabelaPagamentos";
import HistoricoAssembleias from "@/app/components/pagamentos/HistoricoAssembleias";
import ModalConfirmacao from "@/app/components/pagamentos/ModalConfirmacao";

function anoMes(valor) {
    if (!valor) return null;
    const s = typeof valor === "string" ? valor : new Date(valor).toISOString();
    const [ano, mes] = s.replace("T", " ").split(" ")[0].split("-");
    return `${ano}-${String(mes).padStart(2, "0")}`;
}

function anoMesAnterior(valor) {
    if (!valor) return null;
    const s = typeof valor === "string" ? valor : new Date(valor).toISOString();
    const [ano, mes] = s.replace("T", " ").split(" ")[0].split("-");
    const d = new Date(Number(ano), Number(mes) - 2); // -1 (0-index) -1 (mês anterior)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function verificarMesAssembleia(lista, assembleia) {
    const mesReferencia = anoMesAnterior(assembleia.ass_data);
    if (!mesReferencia) return false;

    const cotasConfirmadas = new Set(
        lista
            .filter(p => p.pag_status === "CONFIRMADO" && anoMes(p.pag_datageracao) === mesReferencia)
            .map(p => p.cot_id)
    );

    const todasCotas = new Set(lista.map(p => p.cot_id));
    return todasCotas.size > 0 && cotasConfirmadas.size >= todasCotas.size;
}

//  componente principal 
export default function PagamentosConsorcio() {
    const { id }      = useParams();
    const { usuario } = useContext(UserContext);

    const [lista,         setLista]        = useState([]);
    const [assembleias,   setAssembleias]  = useState([]);
    const [nomeConsorcio, setNome]         = useState("");
    const [loading,       setLoading]      = useState(true);
    const [realizando,    setRealizando]   = useState(false);
    const [resultado,     setResultado]    = useState(null);
    const [modalAberto,   setModalAberto]  = useState(false);
    const socketRef = useRef(null);

    //  próxima assembleia não realizada 
    const proximaAssembleia = assembleias.find(a => !a.cot_sorteada_id) || null;
    const podeRealizar = proximaAssembleia
        ? verificarMesAssembleia(lista, proximaAssembleia)
        : false;

    const mesReferencia = proximaAssembleia ? anoMesAnterior(proximaAssembleia.ass_data) : null;
    const listaMes = mesReferencia
        ? lista.filter(p => anoMes(p.pag_datageracao) === mesReferencia)
        : lista;

    const confirmados     = listaMes.filter(p => p.pag_status === "CONFIRMADO").length;
    const pendentes       = listaMes.filter(p => p.pag_status === "PENDENTE").length;
    const totalArrecadado = lista
        .filter(p => p.pag_status === "CONFIRMADO")
        .reduce((acc, p) => acc + Number(p.pag_valor), 0);

    //  Socket 
    useEffect(() => {
        if (!usuario || !id) return;
        let socket;
        import("socket.io-client").then(({ io }) => {
            socket = io("http://localhost:5000", { withCredentials: true });
            socketRef.current = socket;
            socket.on("pagamento:confirmado", () => carregar(false));
        });
        return () => socket?.disconnect();
    }, [usuario, id]);

    //  carregamento 
    async function carregar(showLoading = true) {
        if (!id) return;
        if (showLoading) setLoading(true);
        try {
            const [pagamentos, assData] = await Promise.all([
                ApiClient.get(`consorcio/${id}/pagamentos`),
                ApiClient.get(`assembleia/${id}`)
            ]);
            setLista(Array.isArray(pagamentos) ? pagamentos : []);
            setAssembleias(Array.isArray(assData) ? assData : []);
            if (Array.isArray(pagamentos) && pagamentos.length > 0)
                setNome(pagamentos[0].con_nome || "");
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    }

    useEffect(() => { carregar(); }, [id]);

    //  realizar assembleia 
    async function confirmarAssembleia() {
        if (!proximaAssembleia) return;
        setRealizando(true);
        try {
            const data = await ApiClient.post("assembleia", {
                idConsorcio:      id,
                numeroAssembleia: proximaAssembleia.ass_numero
            });
            setResultado(data?.cotaSorteada || null);
            setModalAberto(false);
            await carregar(false);
        } catch (e) {
            alert("Erro ao realizar assembleia: " + e.message);
        } finally {
            setRealizando(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div>
            {/* Modal de confirmação */}
            {modalAberto && proximaAssembleia && (
                <ModalConfirmacao
                    titulo={`Assembleia #${proximaAssembleia.ass_numero}`}
                    mensagem={`Todas as cotas do mês de referência já foram pagas.`}
                    subtexto={`O sorteio será feito entre as cotas ainda não contempladas.`}
                    onConfirmar={confirmarAssembleia}
                    onCancelar={() => setModalAberto(false)}
                    carregando={realizando}
                />
            )}

            {/* Cabeçalho */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="h3 mb-0 text-gray-800">
                        <i className="fas fa-money-bill-wave text-success mr-2"></i>
                        Pagamentos do Consórcio
                    </h1>
                    {nomeConsorcio && <small className="text-muted">{nomeConsorcio}</small>}
                </div>
                <div className="d-flex align-items-center" style={{ gap: 8 }}>
                    <span className="badge badge-success p-2" title="Atualizando em tempo real">
                        <i className="fas fa-circle fa-xs mr-1"></i> Ao vivo
                    </span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => carregar()}>
                        <i className="fas fa-sync-alt mr-1"></i> Atualizar
                    </button>
                    <Link href="/admin/consorcio/meusConsorcios" className="btn btn-sm btn-outline-secondary">
                        <i className="fas fa-arrow-left mr-1"></i> Voltar
                    </Link>
                </div>
            </div>

            {/* Banner resultado */}
            {resultado && (
                <div className="alert alert-success d-flex align-items-center justify-content-between mb-4 shadow-sm">
                    <span>
                        <i className="fas fa-trophy mr-2"></i>
                        <strong>Assembleia realizada!</strong>
                        {" "}Cota <strong>#{resultado.numero}</strong> foi contemplada!
                    </span>
                    <button className="close ml-3" onClick={() => setResultado(null)}>
                        <span>&times;</span>
                    </button>
                </div>
            )}

            {/* Cards + botão */}
            {lista.length > 0 && (
                <ResumoCards
                    confirmados={confirmados}
                    pendentes={pendentes}
                    totalArrecadado={totalArrecadado}
                    podeRealizar={podeRealizar}
                    realizando={realizando}
                    onRealizar={() => setModalAberto(true)}
                />
            )}

            <TabelaPagamentos lista={lista} />
            <HistoricoAssembleias assembleias={assembleias} />
        </div>
    );
}
