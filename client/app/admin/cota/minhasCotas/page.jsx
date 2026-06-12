'use client'
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";

function verificarStatusCota(cotaStatus, pagamentos = []) {
    if (cotaStatus === "CONTEMPLADA") return "CONTEMPLADA";
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const temInadimplencia = pagamentos.some(pag => {
        if (pag.pag_status === "CONFIRMADO") return false;
        
        const dataVenc = new Date(pag.pag_datageracao);
        dataVenc.setHours(0, 0, 0, 0);
        
        return hoje > dataVenc;
    });
    
    return temInadimplencia ? "INADIMPLEMTE" : "REGULAR";
}

export default function MinhasCotas() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagamentosPorCota, setPagamentosPorCota] = useState({});

   async function carregarMinhasCotas() {
    try {
        let listaCotas = await ApiClient.get("cota/minhasCotas");
        if (Array.isArray(listaCotas)) {   
            setLista(listaCotas);
            
            const pagtos = {};
            for (const cota of listaCotas) {
                try {
                    const pags = await ApiClient.get(`pagamento/cota/${cota.cot_id}`);
                    pagtos[cota.cot_id] = Array.isArray(pags) ? pags : [];
                } catch (error) {
                    pagtos[cota.cot_id] = [];
                }
            }
            setPagamentosPorCota(pagtos);
        } else {
            setLista([]);
        }
    } catch (error) {
        console.error("Erro ao buscar cotas:", error);
        setLista([]);
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
        carregarMinhasCotas();
    }, []);

    return (
        <div>
            {/* Cabeçalho da Página */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Minhas Cotas</h1>
                <Link className="btn btn-primary btn-sm shadow-sm" href="/admin/consorcio">
                    <i className="fas fa-plus fa-sm text-white-50 mr-1"></i>
                    Comprar Cota
                </Link>
            </div>

            {/* Renderização Condicional */}
            {loading ? (
                <Loading />
            ) : lista.length > 0 ? (
                <div className="card shadow mb-4">
                    <div className="card-body">
                        <div className="table-responsive rounded border overflow-hidden">
                            <table className="table table-hover mb-0" width="100%" cellSpacing="0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Id</th>
                                        <th>Consórcio</th>
                                        <th>Número</th>
                                        <th>Status</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((cota, index) => {
                                        const statusVerificado = verificarStatusCota(cota.cot_status, pagamentosPorCota[cota.cot_id] || []);
                                        
                                        // Determina a classe do badge usando o status verificado
                                        const badgeClass =
                                            statusVerificado === 'REGULAR' ? 'badge-success' :
                                            statusVerificado === 'CONTEMPLADA' ? 'badge-warning' :
                                            statusVerificado === 'RESERVADA' ? 'badge-info' :
                                            statusVerificado === 'INADIMPLEMTE' ? 'badge-danger' :
                                            'badge-secondary';

                                        return (
                                            <tr key={index}>
                                                <td><strong>{cota.cot_id}</strong></td>
                                                <td>{cota.con_nome}</td> 
                                                <td>{cota.cot_numero}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <span className={`badge badge-pill ${badgeClass} mr-2`}>
                                                            {statusVerificado}
                                                        </span>

                                                        </div>
                                                </td>
                                                <td>
                                                    <Link
                                                        href={`/admin/consorcio/${cota.con_id}/minhasCotas`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="fas fa-receipt mr-1"></i>Ver Parcelas
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                
                <div className="card shadow">
                    <div className="card-body text-center py-5">
                        <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                        <h5 className="text-gray-500">Nenhuma cota associada a sua conta.</h5>
                        <Link className="btn btn-primary mt-2" href="/admin/consorcio">
                            Comprar primeira cota
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}