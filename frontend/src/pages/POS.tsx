import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Search,
    Plus,
    Minus,
    Trash2,
    DollarSign,
    CreditCard,
    Banknote,
    LogOut,
    User,
    Package,
    LayoutDashboard
} from 'lucide-react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const MOCK_PRODUCTS = [
    { id: 1, name: 'Hidratante Facial', price: 89.90, stock: 15 },
    { id: 2, name: 'Sérum Vitamina C', price: 129.90, stock: 8 },
    { id: 3, name: 'Protetor Solar FPS 50', price: 79.90, stock: 20 },
    { id: 4, name: 'Limpeza Facial', price: 150.00, stock: 5 },
    { id: 5, name: 'Máscara Facial', price: 45.90, stock: 12 },
    { id: 6, name: 'Tônico Facial', price: 59.90, stock: 10 },
];

export default function POS() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPayment, setShowPayment] = useState(false);

    // Get logged user
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Usuário"}');

    const filteredProducts = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const finalizeSale = () => {
        alert('Venda finalizada com sucesso!');
        setCart([]);
        setShowPayment(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={32} />
                            <div>
                                <h1 className="text-2xl font-bold">PDV PELG</h1>
                                <p className="text-sm text-blue-100">Ponto de Venda</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                            >
                                <LayoutDashboard size={20} />
                                Dashboard
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg">
                                <User size={20} />
                                <span>{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all"
                            >
                                <LogOut size={20} />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Search */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Package size={24} className="text-blue-600" />
                                Produtos Disponíveis
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProducts.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                                                {product.name}
                                            </h3>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                {product.stock} un
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            R$ {product.price.toFixed(2)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <ShoppingCart size={24} className="text-purple-600" />
                                Carrinho
                            </h2>

                            {cart.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>Carrinho vazio</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                                        {cart.map(item => (
                                            <div key={item.id} className="border-b border-gray-200 pb-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-medium text-sm">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <span className="font-bold text-blue-600">
                                                        R$ {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t-2 border-gray-300 pt-4 mb-4">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-xl font-bold">Total:</span>
                                            <span className="text-3xl font-bold text-green-600">
                                                R$ {total.toFixed(2)}
                                            </span>
                                        </div>

                                        {!showPayment ? (
                                            <button
                                                onClick={() => setShowPayment(true)}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <DollarSign size={24} />
                                                Finalizar Venda
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <h3 className="font-bold text-center mb-3">Forma de Pagamento</h3>
                                                <button
                                                    onClick={finalizeSale}
                                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <CreditCard size={20} />
                                                    Cartão
                                                </button>
                                                <button
                                                    onClick={finalizeSale}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <Banknote size={20} />
                                                    Dinheiro
                                                </button>
                                                <button
                                                    onClick={finalizeSale}
                                                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <DollarSign size={20} />
                                                    PIX
                                                </button>
                                                <button
                                                    onClick={() => setShowPayment(false)}
                                                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
