'use client'
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import UserContext from "@/app/context/userContext";
import ApiClient from "@/utils/apiClient";
import { moeda } from "@/utils/formatString";

export default function AdminHome() {
    const { usuario } = useContext(UserContext);
    const [dados,   setDados]   = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregar() {
        try {
            const [cons, cotas, saldo] = await Promise.all([
                ApiClient.get("consorcio/meusConsorcios"),
                ApiClient.get("cota/minhasCotas"),
                ApiClient.get(`financeiro/admin/${usuario.id}/saldo`)
            ]);
            setDados({ cons: cons || [], cotas: cotas || [], saldo });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!usuario) return;
        carregar();
    }, [usuario]);

    const cards = dados ? [
        {
            label: "Meus Consórcios",
            valor: dados.cons.length,
            sub:   `${dados.cons.filter(c => c.status === "EM PROCESSO").length} em processo`,
            cor:   "primary",
            icon:  "fa-building",
            link:  "/admin/consorcio/meusConsorcios"
        },
        {
            label: "Minhas Cotas",
            valor: dados.cotas.length,
            sub:   `${dados.cotas.filter(c => c.cot_status === "CONTEMPLADA").length} contempladas`,
            cor:   "success",
            icon:  "fa-ticket-alt",
            link:  "/admin/cota/minhasCotas"
        },
        {
            label: "Saldo Admin",
            valor: moeda(dados.saldo?.valor ?? dados.saldo?.sad_valor ?? 0),
            sub:   "Taxa de administração acumulada",
            cor:   "warning",
            icon:  "fa-wallet",
            link:  "/admin/financeiro"
        }
    ] : [];

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">
                    Olá, {usuario?.nome?.split(" ")[0]}! 👋
                </h1>
                <Link href="/admin/consorcio/cadastrar" className="btn btn-primary btn-sm shadow-sm">
                    <i className="fas fa-plus fa-sm mr-1"></i> Novo Consórcio
                </Link>
            </div>

            <div className="row">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary"></div>
                    </div>
                ) : cards.map((c, i) => (
                    <div key={i} className="col-xl-4 col-md-6 mb-4">
                        <Link href={c.link} style={{ textDecoration: "none" }}>
                            <div className={`card border-left-${c.cor} shadow h-100 py-2`}>
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className={`text-xs font-weight-bold text-${c.cor} text-uppercase mb-1`}>
                                                {c.label}
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">{c.valor}</div>
                                            <small className="text-muted">{c.sub}</small>
                                        </div>
                                        <div className="col-auto">
                                            <i className={`fas ${c.icon} fa-2x text-gray-300`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
