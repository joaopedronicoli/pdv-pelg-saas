import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DatabaseSetup from './pages/setup/DatabaseSetup';
import WooCommerceSetup from './pages/setup/WooCommerceSetup';
import POS from './pages/POS';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup/database" element={<DatabaseSetup />} />
          <Route path="/setup/woocommerce" element={<WooCommerceSetup />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
