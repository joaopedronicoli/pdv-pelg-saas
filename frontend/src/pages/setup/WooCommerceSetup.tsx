import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Globe, Key, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function WooCommerceSetup() {
    const navigate = useNavigate();
    const { company } = useAuth();

    const [storeUrl, setStoreUrl] = useState('');
    const [consumerKey, setConsumerKey] = useState('');
    const [consumerSecret, setConsumerSecret] = useState('');
    const [autoSync, setAutoSync] = useState(true);
    const [testing, setTesting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [error, setError] = useState('');

    const handleTestConnection = async () => {
        setTesting(true);
        setTestResult(null);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/woocommerce/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeUrl,
                    consumerKey,
                    consumerSecret,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setTestResult({
                    success: true,
                    message: `Conectado! Loja: ${data.storeName || 'N/A'}`
                });
            } else {
                setTestResult({ success: false, message: data.message || 'Falha ao conectar' });
            }
        } catch (err: any) {
            setTestResult({ success: false, message: 'Erro ao testar conexão: ' + err.message });
        } finally {
            setTesting(false);
        }
    };

    const handleSaveAndSync = async () => {
        if (!testResult?.success) {
            setError('Por favor, teste a conexão antes de salvar');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Encrypt and save to backend first
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/woocommerce/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: company?.id,
                    storeUrl,
                    consumerKey,
                    consumerSecret,
                    autoSync,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Save to Supabase
                const { error: supabaseError } = await supabase
                    .from('woocommerce_configs')
                    .insert({
                        company_id: company?.id,
                        store_url: storeUrl,
                        consumer_key_encrypted: data.encryptedKey,
                        consumer_secret_encrypted: data.encryptedSecret,
                        auto_sync: autoSync,
                    });

                if (supabaseError) throw supabaseError;

                navigate('/pos');
            } else {
                setError(data.message || 'Erro ao salvar configuração');
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
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                            <ShoppingBag size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Integração WooCommerce</h1>
                            <p className="text-purple-100">Passo 2 de 2 - Sincronize seus produtos</p>
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
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        <p className="font-semibold mb-2">📝 Como obter as credenciais:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>Acesse seu WordPress Admin</li>
                            <li>Vá em WooCommerce → Configurações → Avançado → API REST</li>
                            <li>Clique em "Adicionar chave"</li>
                            <li>Defina permissões como "Leitura/Escrita"</li>
                            <li>Copie a Consumer Key e Consumer Secret</li>
                        </ol>
                    </div>

                    <div>
                        <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                            <Globe size={16} className="inline mr-2" />
                            URL da Loja
                        </label>
                        <input
                            id="storeUrl"
                            type="url"
                            value={storeUrl}
                            onChange={(e) => setStoreUrl(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            placeholder="https://minhaloja.com.br"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="consumerKey" className="block text-sm font-medium text-gray-700 mb-2">
                            <Key size={16} className="inline mr-2" />
                            Consumer Key
                        </label>
                        <input
                            id="consumerKey"
                            type="text"
                            value={consumerKey}
                            onChange={(e) => setConsumerKey(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono text-sm"
                            placeholder="ck_xxxxxxxxxxxxxxxx"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700 mb-2">
                            <Key size={16} className="inline mr-2" />
                            Consumer Secret
                        </label>
                        <input
                            id="consumerSecret"
                            type="password"
                            value={consumerSecret}
                            onChange={(e) => setConsumerSecret(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono text-sm"
                            placeholder="cs_xxxxxxxxxxxxxxxx"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <input
                            id="autoSync"
                            type="checkbox"
                            checked={autoSync}
                            onChange={(e) => setAutoSync(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="autoSync" className="text-sm text-gray-700">
                            Sincronizar produtos automaticamente a cada hora
                        </label>
                    </div>

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

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleTestConnection}
                            disabled={testing || !storeUrl || !consumerKey || !consumerSecret}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {testing ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Testando...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={20} />
                                    Testar Conexão
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveAndSync}
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
                                    <ArrowRight size={20} />
                                    Salvar e Continuar
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                    >
                        Pular por enquanto (pode configurar depois)
                    </button>
                </div>
            </div>
        </div>
    );
}
