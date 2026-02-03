import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Lock, Mail, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validations
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (!companyName.trim()) {
            setError('Nome da empresa é obrigatório');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp(email, password, companyName);

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/setup/database');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/setup/database`,
                },
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao registrar com Google');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand to-primary-700 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-dark to-brand p-10 text-white text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                    <div className="relative flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl shadow-lg">
                            <ShoppingCart size={56} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">Criar Conta</h1>
                    <p className="text-blue-100 text-sm font-medium">Comece grátis em minutos</p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="p-8 space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
                        <p className="text-gray-600 text-sm">Crie sua conta e comece a vender</p>
                    </div>

                    {/* Google Signup Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Registrar com Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">ou preencha os dados</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome da Empresa
                        </label>
                        <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="companyName"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-800"
                                placeholder="Minha Empresa Ltda"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-800"
                                placeholder="seu@email.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-800"
                                placeholder="Mínimo 6 caracteres"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirmar Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-gray-800"
                                placeholder="Digite a senha novamente"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3">
                            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3">
                            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <span className="font-medium">Conta criada com sucesso! Redirecionando...</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full bg-gradient-to-r from-brand-dark to-brand text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Criando conta...
                            </span>
                        ) : success ? (
                            'Conta criada!'
                        ) : (
                            'Criar Conta Grátis'
                        )}
                    </button>

                    <div className="text-center space-y-3">
                        <p className="text-sm text-gray-600">
                            Já tem uma conta?{' '}
                            <Link to="/login" className="text-brand hover:text-brand-dark font-bold transition-colors">
                                Fazer login
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                            Ao criar uma conta, você concorda com nossos Termos de Uso
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
