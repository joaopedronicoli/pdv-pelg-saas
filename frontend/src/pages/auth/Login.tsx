import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await signIn(email, password);

            if (error) {
                setError(error.message);
            } else {
                navigate('/pos');
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[10px] opacity-50">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnptLTIgMHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptMC00djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

            {/* Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Logo/Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50 transform hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                                    PDV PELG
                                </h1>
                                <p className="text-purple-200">Sistema de Gestão Inteligente</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-purple-100 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300"
                                        placeholder="seu@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-purple-100 mb-2">
                                        Senha
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-sm animate-shake">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Entrando...
                                        </span>
                                    ) : (
                                        'Entrar'
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-purple-200">
                                    Não tem uma conta?{' '}
                                    <Link to="/register" className="text-white font-semibold hover:text-purple-200 transition-colors">
                                        Criar conta grátis →
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                                <p className="text-xs text-purple-300">
                                    🚀 Versão 2.0.0 SaaS • © 2026 PELG
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -z-10 top-0 left-0 w-full h-full">
                        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-10 right-10 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-1000"></div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    );
}
