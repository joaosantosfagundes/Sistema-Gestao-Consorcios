'use client'
import Link from "next/link";

export default function Home() {
    return (
        <>
            <style>{`
                .landing {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a3b6e 0%, #0d2247 50%, #0a1a35 100%);
                    color: #f4f8ff;
                    font-family: 'Nunito', sans-serif;
                }
                .nav-land {
                    background: rgba(10,26,53,0.85);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(23,195,212,0.12);
                }
                .hero-title { font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; line-height: 1.1; letter-spacing: -1px; }
                .hero-title em { font-style: normal; color: #17c3d4; }
                .hero-sub { color: rgba(200,215,240,0.8); font-size: 1.05rem; line-height: 1.7; }
                .btn-ciano {
                    background: linear-gradient(90deg, #17c3d4, #1e4da0);
                    color: #0a1a35 !important;
                    border: none;
                    font-weight: 800;
                    border-radius: 50px;
                    padding: 12px 32px;
                    transition: transform .2s, box-shadow .2s;
                    box-shadow: 0 6px 24px rgba(23,195,212,.3);
                }
                .btn-ciano:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(23,195,212,.5); }
                .btn-ghost {
                    background: transparent;
                    color: rgba(200,220,255,.85) !important;
                    border: 1.5px solid rgba(200,220,255,.25);
                    font-weight: 600;
                    border-radius: 50px;
                    padding: 12px 28px;
                    transition: all .2s;
                }
                .btn-ghost:hover { border-color: rgba(200,220,255,.7); color: #fff !important; background: rgba(255,255,255,.05); }
                /* Cards flutuantes */
                .h-card {
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    backdrop-filter: blur(8px);
                    padding: 20px 22px;
                }
                .h-card:last-child { animation: float 4s ease-in-out infinite; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                .label-ciano { color: #17c3d4; font-size: .7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
                .card-value { font-size: 1.5rem; font-weight: 900; }
                .card-sub { font-size: .78rem; color: rgba(190,210,240,.6); }
                .bar-bg { height: 5px; background: rgba(255,255,255,.1); border-radius: 10px; overflow: hidden; margin-top: 12px; }
                .bar-fill { height: 100%; width: 68%; background: linear-gradient(90deg,#17c3d4,#1e4da0); border-radius: 10px; }
                /* Feature cards */
                .feat-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    transition: transform .25s, background .25s;
                }
                .feat-card:hover { transform: translateY(-4px); background: rgba(23,195,212,.06); border-color: rgba(23,195,212,.2); }
                .feat-icon {
                    width: 42px; height: 42px;
                    background: linear-gradient(135deg, #17c3d4, #1e4da0);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem;
                }
                .footer { color: rgba(180,200,230,.35); border-top: 1px solid rgba(255,255,255,.05); font-size: .82rem; }
            `}</style>

            <div className="landing">

                {/* Navbar */}
                <nav className="nav-land navbar navbar-expand px-4 py-3 sticky-top">
                    <span className="navbar-brand fw-800 text-white d-flex align-items-center gap-2" style={{ fontWeight: 800 }}>
                        <i className="fas fa-shield-alt" style={{ color: '#17c3d4' }}></i>
                        Consórcio <span style={{ color: '#17c3d4' }}>Abacatudo</span>
                    </span>
                    <div className="ms-auto d-flex gap-2">
                        <Link href="/login" className="btn btn-ghost">Entrar</Link>
                        <Link href="/login/cadastrar" className="btn btn-ciano">Cadastre-se grátis</Link>
                    </div>
                </nav>

                {/* Hero */}
                <div className="container py-5">
                    <div className="row align-items-center g-5 py-4">
                        <div className="col-lg-6">
                            <div className="badge mb-3 px-3 py-2" style={{ background: 'rgba(23,195,212,.15)', border: '1px solid rgba(23,195,212,.4)', color: '#17c3d4', borderRadius: 50, fontSize: '.75rem', fontWeight: 700, letterSpacing: 1 }}>
                                🚀 CONSÓRCIO DIGITAL
                            </div>
                            <h1 className="hero-title mb-3">
                                Realize seus sonhos com <em>consórcio inteligente</em>
                            </h1>
                            <p className="hero-sub mb-4">
                                Crie ou participe de grupos de consórcio de forma simples.
                                Pagamento via PIX, transparência total e sorteios automáticos.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link href="/login/cadastrar" className="btn btn-ciano">Começar agora</Link>
                                <Link href="/login" className="btn btn-ghost">Já tenho conta</Link>
                            </div>
                        </div>

                        {/* Cards decorativos */}
                        <div className="col-lg-6 d-none d-lg-flex justify-content-center">
                            <div style={{ position: 'relative', width: 300, height: 260 }}>
                                {[
                                    { label: 'Parcelas pagas', value: '7/12', sub: 'Cota #3 · Consórcio Imóvel', rotate: '-4deg', bottom: 0, left: 40 },
                                    { label: 'Próxima assembleia', value: '15 Jun', sub: 'Sorteio automático', rotate: '-1deg', bottom: 30, left: 20 },
                                ].map((c, i) => (
                                    <div key={i} className="h-card" style={{ position: 'absolute', width: 260, bottom: c.bottom, left: c.left, transform: `rotate(${c.rotate})` }}>
                                        <div className="label-ciano mb-1">{c.label}</div>
                                        <div className="card-value">{c.value}</div>
                                        <div className="card-sub">{c.sub}</div>
                                    </div>
                                ))}
                                <div className="h-card" style={{ position: 'absolute', width: 260, bottom: 60, left: 0, transform: 'rotate(2deg)' }}>
                                    <div className="label-ciano mb-1">Saldo do consórcio</div>
                                    <div className="card-value">R$ 24.800</div>
                                    <div className="card-sub">Fundo acumulado</div>
                                    <div className="bar-bg"><div className="bar-fill"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="container pb-5">
                    <h2 className="text-center fw-bold mb-5" style={{ fontSize: '1.8rem' }}>
                        Tudo que você precisa em um só <span style={{ color: '#17c3d4' }}>lugar</span>
                    </h2>
                    <div className="row g-3">
                        {[
                            { icon: '💳', name: 'Pagamento via PIX', desc: 'Gere QR Code na hora e pague sua parcela em segundos.' },
                            { icon: '🎲', name: 'Sorteios automáticos', desc: 'Assembleias mensais com sorteio justo entre as cotas.' },
                            { icon: '📊', name: 'Painel financeiro', desc: 'Acompanhe saldos, movimentações e histórico completo.' },
                            { icon: '🔒', name: 'Seguro e transparente', desc: 'Cada centavo registrado. Taxas definidas na criação.' },
                        ].map((f, i) => (
                            <div key={i} className="col-sm-6 col-lg-3">
                                <div className="feat-card p-4 h-100">
                                    <div className="feat-icon mb-3">{f.icon}</div>
                                    <div className="fw-bold mb-2">{f.name}</div>
                                    <div style={{ fontSize: '.87rem', color: 'rgba(190,210,240,.7)', lineHeight: 1.6 }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="footer text-center py-4">
                    © 2026 Consórcio Abacatudo · Todos os direitos reservados
                </footer>
            </div>
        </>
    );
}
