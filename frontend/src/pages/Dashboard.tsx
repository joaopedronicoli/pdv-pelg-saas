import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    TrendingUp,
    DollarSign,
    Package,
    Users,
    ArrowLeft,
    Calendar
} from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    const stats = [
        {
            title: 'Vendas Hoje',
            value: 'R$ 2.450,00',
            icon: DollarSign,
            color: 'bg-green-500',
            trend: '+12%'
        },
        {
            title: 'Transações',
            value: '24',
            icon: ShoppingCart,
            color: 'bg-blue-500',
            trend: '+8%'
        },
        {
            title: 'Produtos',
            value: '156',
            icon: Package,
            color: 'bg-purple-500',
            trend: '+3'
        },
        {
            title: 'Clientes',
            value: '89',
            icon: Users,
            color: 'bg-orange-500',
            trend: '+15'
        },
    ];

    const recentSales = [
        { id: 1, customer: 'Maria Silva', total: 189.90, time: '10:30', items: 3 },
        { id: 2, customer: 'João Santos', total: 459.80, time: '11:15', items: 5 },
        { id: 3, customer: 'Ana Costa', total: 129.90, time: '12:00', items: 2 },
        { id: 4, customer: 'Pedro Lima', total: 299.70, time: '13:45', items: 4 },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={32} />
                            <div>
                                <h1 className="text-2xl font-bold">Dashboard</h1>
                                <p className="text-sm text-blue-100">Visão Geral do Sistema</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/pos')}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
                        >
                            <ArrowLeft size={20} />
                            Voltar ao PDV
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {/* Date */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" />
                    <span className="font-semibold">
                        {new Date().toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon size={24} className="text-white" />
                                </div>
                                <span className="text-green-600 font-semibold text-sm">
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Sales */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingCart size={24} className="text-blue-600" />
                            Vendas Recentes
                        </h2>
                        <div className="space-y-3">
                            {recentSales.map(sale => (
                                <div key={sale.id} className="border-b border-gray-200 pb-3 last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{sale.customer}</h4>
                                            <p className="text-sm text-gray-500">{sale.items} itens</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">R$ {sale.total.toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">{sale.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Package size={24} className="text-purple-600" />
                            Produtos Mais Vendidos
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Hidratante Facial', sales: 45, revenue: 4045.50 },
                                { name: 'Sérum Vitamina C', sales: 32, revenue: 4156.80 },
                                { name: 'Protetor Solar FPS 50', sales: 28, revenue: 2237.20 },
                                { name: 'Limpeza Facial', sales: 18, revenue: 2700.00 },
                            ].map((product, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-sm text-gray-500">{product.sales} vendas</span>
                                            <span className="text-sm font-semibold text-green-600">
                                                R$ {product.revenue.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                        <Package size={32} className="text-blue-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
                            <Package size={32} className="mx-auto mb-2 text-blue-600" />
                            <p className="font-semibold text-sm">Produtos</p>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all">
                            <Users size={32} className="mx-auto mb-2 text-purple-600" />
                            <p className="font-semibold text-sm">Clientes</p>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all">
                            <DollarSign size={32} className="mx-auto mb-2 text-green-600" />
                            <p className="font-semibold text-sm">Relatórios</p>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-lg transition-all">
                            <TrendingUp size={32} className="mx-auto mb-2 text-orange-600" />
                            <p className="font-semibold text-sm">Análises</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
