'use client'
import { useContext, useEffect, useState } from "react";
import UserContext from "@/app/context/userContext";
import ApiClient from "@/utils/apiClient";
import Loading from "@/app/components/loading";
import SaldoCards from "@/app/components/financeiro/SaldoCards";
import MovimentacoesConsorcio from "@/app/components/financeiro/MovimentacoesConsorcio";
import MovimentacoesAdmin from "@/app/components/financeiro/MovimentacoesAdmin";

export default function FinanceiroPage() {
    const { usuario } = useContext(UserContext);

    const [consorcios,     setConsorcios]     = useState([]);
    const [conSelecionado, setConSelecionado] = useState("");
    const [saldoCon,       setSaldoCon]       = useState(null);
    const [movCon,         setMovCon]         = useState([]);
    const [saldoAdm,       setSaldoAdm]       = useState(null);
    const [movAdm,         setMovAdm]         = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [loadingCon,     setLoadingCon]     = useState(false);
    const [aba,            setAba]            = useState("consorcio");

    useEffect(() => {
        if (!usuario) return;
        async function init() {
            try {
                const data = await ApiClient.get("consorcio/meusConsorcios");
                if (data?.length > 0) {
                    setConsorcios(data);
                    setConSelecionado(String(data[0].id));
                }
                await carregarAdmin();
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [usuario]);

    useEffect(() => {
        if (conSelecionado) carregarConsorcio(conSelecionado);
    }, [conSelecionado]);

    async function carregarConsorcio(conId) {
        setLoadingCon(true);
        try {
            const [saldo, mov] = await Promise.all([
                ApiClient.get(`financeiro/consorcio/${conId}/saldo`),
                ApiClient.get(`financeiro/consorcio/${conId}/movimentacoes`),
            ]);
            if (saldo) setSaldoCon(saldo);
            if (mov)   setMovCon(mov);
        } finally {
            setLoadingCon(false);
        }
    }

    async function carregarAdmin() {
        if (!usuario) return;
        const [saldo, mov] = await Promise.all([
            ApiClient.get(`financeiro/admin/${usuario.id}/saldo`),
            ApiClient.get(`financeiro/admin/${usuario.id}/movimentacoes`),
        ]);
        if (saldo) setSaldoAdm(saldo);
        if (mov)   setMovAdm(mov);
    }

    if (loading) return <Loading />;

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="h3 mb-0 text-gray-800">
                        <i className="fas fa-chart-line text-primary mr-2"></i>
                        Painel Financeiro
                    </h1>
                    <small className="text-muted">Saldos e movimentações dos seus consórcios</small>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                    carregarAdmin();
                    if (conSelecionado) carregarConsorcio(conSelecionado);
                }}>
                    <i className="fas fa-sync-alt mr-1"></i> Atualizar
                </button>
            </div>

            <SaldoCards saldoCon={saldoCon} saldoAdm={saldoAdm} loadingCon={loadingCon} />

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button className={`nav-link ${aba === "consorcio" ? "active" : ""}`} onClick={() => setAba("consorcio")}>
                        <i className="fas fa-building mr-1"></i>Movimentações do Consórcio
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${aba === "admin" ? "active" : ""}`} onClick={() => setAba("admin")}>
                        <i className="fas fa-user-tie mr-1"></i>Minhas Movimentações
                    </button>
                </li>
            </ul>

            {aba === "consorcio" && (
                <MovimentacoesConsorcio
                    consorcios={consorcios}
                    conSelecionado={conSelecionado}
                    onChangeCon={setConSelecionado}
                    movCon={movCon}
                    loading={loadingCon}
                />
            )}
            {aba === "admin" && <MovimentacoesAdmin movAdm={movAdm} />}
        </div>
    );
}
