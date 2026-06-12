'use client'
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatarData } from "@/utils/formatString";

function badgeStatus(status) {
    if (status === "EM PROCESSO") return "badge-success";
    if (status === "FINALIZADO")  return "badge-secondary";
    return "badge-light";
}

export default function MeusConsorcios() {
    const [lista,   setLista]   = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregar() {
       try{
            const dados = await ApiClient.get("consorcio/meusConsorcios");
             if (dados) setLista(dados);
       }catch(error){
            console.error("Erro ao buscar consórcios:", error);
            setLista([]); 
       }
       finally{setLoading(false);}
        
    }

    useEffect(() => { carregar(); }, []);

    if (loading) return <Loading />;

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">
                    <i className="fas fa-piggy-bank text-primary mr-2"></i>
                    Meus Consórcios
                </h1>
                <Link className="btn btn-primary btn-sm shadow-sm" href="/admin/consorcio/cadastrar">
                    <i className="fas fa-plus fa-sm text-white-50 mr-1"></i>
                    Novo Consórcio
                </Link>
            </div>

            {lista.length === 0 ? (
                <div className="card shadow">
                    <div className="card-body text-center py-5">
                        <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                        <h5 className="text-gray-500">Nenhum consórcio cadastrado na sua conta.</h5>
                        <Link className="btn btn-primary mt-2" href="/admin/consorcio/cadastrar">
                            Cadastrar o primeiro consórcio
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex align-items-center justify-content-between">
                        <h6 className="m-0 font-weight-bold text-primary">Seus Consórcios</h6>
                        <span className="badge badge-primary badge-pill">{lista.length}</span>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive rounded border overflow-hidden">
                           <table className="table table-hover mb-0" width="100%" cellSpacing="0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Nome</th>
                                        <th>Cotas</th>
                                        <th>Mensalidade</th>
                                        <th>Prêmio</th>
                                        <th>Status</th>
                                        <th>Início</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((c) => (
                                        <tr key={c.id}>
                                            <td><strong>{c.id}</strong></td>
                                            <td>{c.nome}</td>
                                            <td>{c.quantidadeCotas}</td>
                                            <td>R$ {Number(c.valorMensal).toFixed(2)}</td>
                                            <td>R$ {Number(c.valorPremio).toFixed(2)}</td>
                                            <td>
                                                <span className={`badge badge-pill ${badgeStatus(c.status)}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td>
                                                {c.dataInicio
                                                    ? formatarData(c.dataInicio)
                                                    : "—"}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1" style={{ gap: 4 }}>
                                                    <Link
                                                        className="btn btn-info btn-sm"
                                                        href={`/admin/consorcio/meusPagamentos/${c.id}`}
                                                        title="Ver pagamentos"
                                                    >
                                                        <i className="fas fa-money-bill-wave mr-1"></i>
                                                        Pagamentos
                                                    </Link>
                                                    <Link
                                                        className="btn btn-primary btn-sm"
                                                        href={`/admin/consorcio/${c.id}/cotas`}
                                                        title="Ver cotas"
                                                    >
                                                        <i className="fas fa-ticket-alt mr-1"></i>
                                                        Cotas
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
