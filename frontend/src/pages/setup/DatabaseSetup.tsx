import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Server, Key, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DatabaseSetup() {
    const navigate = useNavigate();
    const { company, refreshCompany } = useAuth();

    const [dbType, setDbType] = useState<'mysql' | 'postgres'>('postgres');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('5432');
    const [database, setDatabase] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [testing, setTesting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [error, setError] = useState('');

    const handleDbTypeChange = (type: 'mysql' | 'postgres') => {
        setDbType(type);
        setPort(type === 'mysql' ? '3306' : '5432');
    };

    const handleTestConnection = async () => {
        setTesting(true);
        setTestResult(null);
        setError('');

        try {
            // Call backend API to test connection
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/database/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dbType,
                    host,
                    port: parseInt(port),
                    database,
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setTestResult({ success: true, message: 'Conexão testada com sucesso!' });
            } else {
                setTestResult({ success: false, message: data.message || 'Falha ao conectar' });
            }
        } catch (err: any) {
            setTestResult({ success: false, message: 'Erro ao testar conexão: ' + err.message });
        } finally {
            setTesting(false);
        }
    };

    const handleSaveAndCreate = async () => {
        if (!testResult?.success) {
            setError('Por favor, teste a conexão antes de salvar');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Call backend to create database and tables
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/database/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: company?.id,
                    dbType,
                    host,
                    port: parseInt(port),
                    database,
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Save config to Supabase
                const { error: supabaseError } = await supabase
                    .from('database_configs')
                    .insert({
                        company_id: company?.id,
                        db_type: dbType,
                        host,
                        port: parseInt(port),
                        database_name: database,
                        username,
                        password_encrypted: data.encryptedPassword,
                        is_connected: true,
                    });

                if (supabaseError) throw supabaseError;

                await refreshCompany();
                navigate('/setup/woocommerce');
            } else {
                setError(data.message || 'Erro ao criar banco de dados');
            }
        } catch (err: any) {
            setError('Erro ao salvar configuração: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        navigate('/pos');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                            <Database size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Configuração de Banco de Dados</h1>
                            <p className="text-blue-100">Passo 1 de 2 - Configure sua conexão</p>
                        </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                        <p className="text-sm">
                            <strong>Empresa:</strong> {company?.name}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                    {/* Database Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tipo de Banco de Dados
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleDbTypeChange('postgres')}
                                className={`p-4 border-2 rounded-lg transition-all ${dbType === 'postgres'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Database className="mx-auto mb-2" size={32} />
                                <p className="font-semibold">PostgreSQL</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDbTypeChange('mysql')}
                                className={`p-4 border-2 rounded-lg transition-all ${dbType === 'mysql'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <Database className="mx-auto mb-2" size={32} />
                                <p className="font-semibold">MySQL</p>
                            </button>
                        </div>
                    </div>

                    {/* Connection Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-2">
                                <Server size={16} className="inline mr-2" />
                                Host / IP
                            </label>
                            <input
                                id="host"
                                type="text"
                                value={host}
                                onChange={(e) => setHost(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="localhost ou IP"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-2">
                                Porta
                            </label>
                            <input
                                id="port"
                                type="number"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="database" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Banco de Dados
                        </label>
                        <input
                            id="database"
                            type="text"
                            value={database}
                            onChange={(e) => setDatabase(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="pdv_empresa"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Se não existir, será criado automaticamente
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Usuário
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                <Key size={16} className="inline mr-2" />
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Test Result */}
                    {testResult && (
                        <div
                            className={`p-4 rounded-lg flex items-start gap-2 ${testResult.success
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                                }`}
                        >
                            {testResult.success ? (
                                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            )}
                            <span className="text-sm">{testResult.message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={testing || !host || !port || !database || !username || !password}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {testing ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Testando...
                                </>
                            ) : (
                                <>
                                    <Server size={20} />
                                    Testar Conexão
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveAndCreate}
                            disabled={saving || !testResult?.success}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Salvar e Criar DB
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                    >
                        Pular por enquanto
                    </button>
                </div>
            </div>
        </div>
    );
}
