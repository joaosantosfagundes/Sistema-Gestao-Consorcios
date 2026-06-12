'use client'
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import toast from "react-hot-toast";
import UserContext from "../context/userContext";
import Link from "next/link";

export default function LoginPage() {

    const email = useRef("");
    const senha = useRef("");
    const { setUsuario } = useContext(UserContext);

    const router = useRouter();

    async function logar() {
        if (email.current.value !== "" && senha.current.value !== "") {
            let response = await fetch("http://localhost:5000/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.current.value,
                    senha: senha.current.value
                })
            });
            let corpo = await response.json();
            if (response.ok) {
                setUsuario(corpo.usuario);
                router.replace("/admin");
            }
            else {
                toast.error(corpo.msg);
            }
        }
        else {
            toast.error("Preencha o e-mail e a senha!");
        }
    }

    return (
        /* Div principal cobrindo a tela toda com o gradiente e centralizando tudo */
        <div 
            className="container-fluid d-flex align-items-center justify-content-center min-vh-100" 
            style={{ background: 'linear-gradient(135deg, #17c3d4, #1e4da0)' }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-5 col-lg-7 col-md-9">

                        {/* Card centralizado sem a margem my-5 antiga */}
                        <div className="card o-hidden border-0 shadow-lg">
                            <div className="card-body p-5">
                                
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">Faça o login abaixo</h1>
                                </div>

                                <form className="user">
                                    
                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold small text-gray-700">E-mail</label>
                                        <input 
                                            ref={email} 
                                            type="email" 
                                            className="form-control form-control-user"
                                            placeholder="Insira seu e-mail..." 
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="font-weight-bold small text-gray-700">Senha</label>
                                        <input 
                                            ref={senha} 
                                            type="password" 
                                            className="form-control form-control-user"
                                            placeholder="Sua senha..." 
                                        />
                                    </div>

                                    <button 
                                        onClick={logar} 
                                        type="button" 
                                        className=" btn btn-primary btn-user btn-block shadow-sm "
                                    >
                                        Entrar
                                    </button>

                                    <p className="text-center mt-3 small mb-0">
                                        Não tem uma conta?{" "}
                                        <Link href="/login/cadastrar" className="text-primary font-weight-bold">
                                            Crie sua conta aqui
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