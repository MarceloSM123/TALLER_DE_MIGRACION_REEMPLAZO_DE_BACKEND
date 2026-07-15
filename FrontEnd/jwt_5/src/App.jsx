import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Registrar from './pages/Registrar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import GestionLibros from './pages/GestionLibros';
import { AuthProvider1 } from './context/appContext';

function App() {
    return (
        <AuthProvider>
            <AuthProvider1>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Registrar />} />
                <Route path="/info" element={<info />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/admin" element={<admin />} />
                    <Route path="/gestion" element={<GestionLibros />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            </AuthProvider1>
        </AuthProvider>

    );
}

export default App;