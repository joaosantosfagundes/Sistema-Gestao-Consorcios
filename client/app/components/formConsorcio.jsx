'use client'
import ApiClient from "@/utils/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useRef} from "react";
import toast from "react-hot-toast";


export default function FormConsorcio() {

    const router = useRouter();

    const nome = useRef("");
    const quantidadeCotas = useRef("");
    const valorPremio = useRef("");
    const taxaAdministracao = useRef("");
    const fundoReserva  = useRef("");
    const diaAssembleia = useRef("");

    async function gravar() {
        //valida os campos
        if(nome.current.value != "" &&
            quantidadeCotas.current.value > 0 &&
            valorPremio.current.value > 0 &&
            taxaAdministracao.current.value > 0 &&
            fundoReserva.current.value > 0 &&
            diaAssembleia.current.value > 0) {

           const body = {
                nome: nome.current.value,
                quantidadeCotas: Number(quantidadeCotas.current.value),
                valorPremio: Number(valorPremio.current.value),
                taxaAdministracao: Number(taxaAdministracao.current.value),
                fundoReserva: Number(fundoReserva.current.value),
                diaAssembleia: Number(diaAssembleia.current.value),
            };    

            //fazer o fetch
            let resposta = await ApiClient.post("consorcio", body);
            if(resposta) {
                toast.success(resposta.msg);
                //navega para a listagem
                router.back();
            }
        }
        else {
            toast.error("Preencha corretamente os campos do formulário");
        }
    }

    return (
        <div>
            <div className="form-group">
                <label>Nome</label>
                <input ref={nome} type="text" className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Cotas</label>
                <input ref={quantidadeCotas} type="text" className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Prêmio</label>
                <input ref={valorPremio} type="text" className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Taxa de Administração</label>
                <input ref={taxaAdministracao} type="text" className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Fundo Reserva</label>
                <input ref={fundoReserva} type="text" className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Dia da Assembleia</label>
                <input ref={diaAssembleia} type="decimal" className="form-control"></input>
            </div>
            <div>
                <button onClick={gravar} className="btn btn-primary"><i className="fas fa-check"></i> Confirmar</button>    
                <Link href="/admin/consorcio" className="btn btn-default"><i className="fas fa-arrow-left"></i> Voltar</Link>
            </div> 
        </div>
    )
}