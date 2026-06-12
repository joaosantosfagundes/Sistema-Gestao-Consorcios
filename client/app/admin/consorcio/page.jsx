'use client'
import Loading from "@/app/components/loading";
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function HomeConsorcio() {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregarConsorcios() {
        let listaConsorcios = await ApiClient.get("consorcio");
        if(listaConsorcios) {   
            setLista(listaConsorcios);
        }
        setLoading(false);

    }

    useEffect(() => {
        carregarConsorcios();
    }, []);

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Consórcios</h1>
            </div>

            {loading ? (
                <Loading />
            ) : lista.length > 0 ? (
                <div className="card shadow mb-4">
                    <div className="card-body">
                         <div className="table-responsive rounded border overflow-hidden">
                            <table className="table table-hover mb-0" width="100%" cellSpacing="0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Nome</th>
                                        <th>Cotas</th>
                                        <th>Prêmio</th>
                                        <th>Mensalidade</th>
                                        <th>Dia da Assembleia</th>
                                        <th>Status</th>
                                        <th>Compra</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((consorcio, index) => (
                                        <tr key={index}>
                                            <td><strong>{consorcio.nome}</strong></td>
                                            <td>{consorcio.quantidadeCotas}</td>
                                            <td>R$ {Number(consorcio.valorPremio).toFixed(2)}</td>
                                            <td>R$ {Number(consorcio.valorMensal).toFixed(2)}</td>
                                            <td>{consorcio.diaAssembleia}</td>
                                            <td>
                                                <span className={`badge badge-pill ${consorcio.status === 'EM PROCESSO' ? 'badge-success' : 'badge-secondary'}`}>
                                                    {consorcio.status}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    className="btn btn-primary btn-sm"
                                                    href={`/admin/consorcio/${consorcio.id}/cotas`}
                                                >
                                                    <i className="fas fa-ticket-alt mr-1"></i>
                                                    Comprar Cota
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card shadow">
                    <div className="card-body text-center py-5">
                        <i className="fas fa-folder-open fa-3x text-gray-300 mb-3"></i>
                        <h5 className="text-gray-500">Nenhum consórcio cadastrado ainda.</h5>
                        <Link className="btn btn-primary mt-2" href="/admin/consorcio/cadastrar">
                            Cadastrar o primeiro consórcio
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
