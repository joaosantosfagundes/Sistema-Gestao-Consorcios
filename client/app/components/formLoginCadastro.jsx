'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function FormLoginCadastro() {

    const router = useRouter();

    const nome = useRef("");
    const email = useRef("");
    const senha = useRef("");

    async function gravar() {

        // valida os campos
        if (
            nome.current.value !== "" &&
            email.current.value !== "" &&
            email.current.value.includes("@") &&
            senha.current.value.length > 0
        ) {

            // cria o objeto para enviar ao backend
            const dados = {
                nome: nome.current.value,
                email: email.current.value,
                senha: senha.current.value
            };

            // fazer o fetch
            let response = await fetch("http://localhost:5000/usuario", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                toast.success("Conta criada com sucesso!");

                // navega para a tela de login
                router.back();
            }
            else {
                toast.error("Erro ao criar conta");
            }
        }
        else {
            toast.error("Preencha corretamente os campos do formulário");
        }
    }

   return (
    // Adicionamos min-vh-100 para ocupar a tela toda, d-flex e align-items-center para centralizar na vertical, e o seu gradiente customizado no inline style
        <div 
            className="container-fluid d-flex align-items-center justify-content-center min-vh-100" 
            style={{ background: 'linear-gradient(135deg, #17c3d4, #1e4da0)' }}
        >

            <div className="container">

                <div className="row justify-content-center">

                    <div className="col-xl-5 col-lg-7 col-md-9">

                        {/* Removi o 'my-5' para o card não ficar sendo empurrado para baixo fora do centro */}
                        <div className="card border-0 shadow-lg">

                            <div className="card-body p-5">

                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">
                                        Vamos criar sua conta
                                    </h1>
                                </div>

                                <form>

                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold small text-gray-700">Nome</label>
                                        <input
                                            ref={nome}
                                            type="text"
                                            className="form-control"
                                            placeholder="Digite seu nome"
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold small text-gray-700">E-mail</label>
                                        <input
                                            ref={email}
                                            type="email"
                                            className="form-control"
                                            placeholder="Digite seu e-mail"
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="font-weight-bold small text-gray-700">Senha</label>
                                        <input
                                            ref={senha}
                                            type="password"
                                            className="form-control"
                                            placeholder="Digite sua senha"
                                        />
                                    </div>

                                    <button
                                        onClick={gravar}
                                        type="button"
                                        className="btn btn-primary btn-block shadow-sm"
                                    >
                                        <i className="fas fa-check"></i> Confirmar
                                    </button>

                                    <p className="text-center mt-3 small mb-0">
                                        <Link href="/login" className="text-primary font-weight-bold">
                                            Voltar para login
                                        </Link>
                                    </p>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}