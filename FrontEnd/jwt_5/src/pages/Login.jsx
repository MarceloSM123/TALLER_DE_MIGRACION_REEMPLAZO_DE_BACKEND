// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ← Importar Link
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Usuario o contraseña incorrecta');
            }

            const datos = await response.json();
            // Corregir: usar la clave correcta del token
            login(datos.token || datos["Token: "]); 
            navigate('/perfil');

        } catch (error) {
            setErr(error.message);
        }
    };

    return (
        <div className="login-container"> 
            <h1>Iniciar Sesión</h1>
            <form onSubmit={manejarSubmit}>
                <div className="form-group">
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {err && <p className="error-message">{err}</p>}

                <button type="submit">Ingresar</button>
            </form>
            
            
            <p className="register-link">
                ¿No tienes una cuenta? <Link to="/registrar">Regístrate aquí</Link>
            </p>
        </div>
    )
}

export default Login;