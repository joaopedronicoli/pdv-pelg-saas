import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validação com credenciais do admin
        if (email === 'joao@patriciaelias.com.br' && password === '31445307@Pe') {
            localStorage.setItem('user', JSON.stringify({ email, name: 'João - Admin', role: 'admin' }));
            navigate('/pos');
        } else if (email && password) {
            // Aceitar qualquer outro login para demonstração
            localStorage.setItem('user', JSON.stringify({ email, name: 'Usuário', role: 'cashier' }));
            navigate('/pos');
        } else {
            setError('Email ou senha inválidos');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <ShoppingCart size={48} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">PDV PELG</h1>
                    <p className="text-blue-100">Sistema de Ponto de Venda</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Digite seu email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                    >
                        <Lock size={20} />
                        Entrar no Sistema
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        <p>Versão 1.0.0 - © 2026 PELG</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
