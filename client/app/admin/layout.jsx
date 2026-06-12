'use client'
import Link from "next/link";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "../context/userContext";

export default function AdminLayout({ children }) {

    const { usuario, setUsuario } = useContext(UserContext);
    const router = useRouter();

    // ✅ Proteção de rota: se não estiver logado, redireciona para /login
    useEffect(() => {
        if (usuario === null) {
            router.replace("/login");
        }
    }, [usuario]);

    // Enquanto verifica o usuário, não renderiza nada (evita flash de conteúdo)
    if (!usuario) return null;

    async function logout() {
        try {
            await fetch("http://localhost:5000/login/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (e) {
            // mesmo se falhar no backend, limpa o estado local
        }
        setUsuario(null);
        router.replace("/login");
    }

    return (
        <div>
            <div id="wrapper">

                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/admin">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fa-laugh-wink"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">Consórcio <sup>Abacatudo</sup></div>
                    </a>

                    <hr className="sidebar-divider my-0" />

                    <li className="nav-item active">
                        <Link className="nav-link" href="/admin">
                            <i className="fas fa-home"></i>
                            <span>Início</span>
                        </Link>
                    </li>

                    <hr className="sidebar-divider" />

                    <div className="sidebar-heading">Menu</div>

                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/consorcio">
                            <i className="fas fa-list"></i>
                            <span>Consórcios</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/consorcio/meusConsorcios">
                            <i className="bi bi-bank"></i>
                            <span>Meus Consórcios</span>
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/cota/minhasCotas">
                            <i className="fas fa-ticket-alt"></i>
                            <span>Minhas Cotas</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/admin/financeiro">
                            <i className="fas fa-chart-line"></i>
                            <span>Financeiro</span>
                        </Link>
                    </li>

                </ul>

                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">

                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>

                            <ul className="navbar-nav ml-auto">
                                <div className="topbar-divider d-none d-sm-block"></div>

                                <li className="nav-item dropdown no-arrow">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="userDropdown"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                            {usuario.nome}
                                        </span>
                                        <img className="img-profile rounded-circle" src="/img/user.jpg" />
                                    </a>

                                    <div
                                        className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown"
                                    >
                                        <div className="dropdown-divider"></div>
                                       
                                        <button className="dropdown-item" onClick={logout}>
                                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </nav>

                        <div className="container-fluid">
                            <div style={{ minHeight: 800 }}>
                                {children}
                            </div>
                        </div>
                    </div>

                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright &copy; Your Website 2026</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up"></i>
            </a>
        </div>
    );
}
