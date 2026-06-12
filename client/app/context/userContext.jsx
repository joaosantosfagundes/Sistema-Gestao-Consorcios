'use client'

import Loading from "../components/loading";
import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregarUsuario() {
        try {
            let response = await fetch("http://localhost:5000/login/usuario", {
                credentials: 'include'
            });

            if (response.ok) {
                let corpo = await response.json();
                setUsuario(corpo);
            } else {
                // Se não ok (401, 404...) limpa o usuário
                setUsuario(null);
            }
        } catch (err) {
            // Erro de rede ou servidor offline — não trava, só loga
            console.warn("Não foi possível restaurar sessão:", err.message);
        } finally {
            // SEMPRE libera o loading, independente de qualquer erro
            setLoading(false);
        }
    }

    // ✅ Carrega usuário ao montar
    useEffect(() => {
        carregarUsuario();
    }, []);

    // ✅ Monitora se o token foi deletado (valida sessão a cada 3s)
    useEffect(() => {
        if (loading) return; // Aguarda carregamento inicial

        const intervalo = setInterval(() => {
            carregarUsuario();
        }, 30000); // Valida a cada 3 segundos

        return () => clearInterval(intervalo);
    }, [loading]);

    if (loading) {
        return (
            <html>
                <body>
                    <Loading />
                </body>
            </html>
        );
    }

    return (
        <UserContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
