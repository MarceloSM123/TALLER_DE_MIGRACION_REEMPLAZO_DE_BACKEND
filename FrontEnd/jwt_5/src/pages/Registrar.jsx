import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

function Registrar() {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('USER');
    const [error, setError] = useState('');
    const [exito, setExito] = useState(false);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        if (username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres.');
            setCargando(false);
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setCargando(false);
            return;
        }

        if (password1!=password) {
            setError('deben conincidir');
            setCargando(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    rol
                }),
            });

            const data = await response.json();

            if (!response.ok) {

                const mensajeError = data.mensaje || data.message || 'Error al registrar el usuario.';
                throw new Error(mensajeError);
            }


            setExito(true);
            setCargando(false);


            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
            setCargando(false);
        }
    };

    return (
        <div className="register-container">
            <h1>Crear una Cuenta</h1>

            {exito && (
                <div className="success-message">
                    ✅ ¡Usuario registrado con éxito! Redirigiendo al login...
                </div>
            )}

            <form onSubmit={manejarSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu usuario"
                        required
                        disabled={exito || cargando}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                        disabled={exito || cargando}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password1">Repite la contraseña</label>
                    <input
                        id="password1"
                        type="password"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        
                        placeholder="Mínimo 6 caracteres"
                        required
                        disabled={exito || cargando}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rol">Rol en el Sistema</label>
                    <select
                        id="rol"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        disabled={exito || cargando}
                    >
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>

                {error && <p className="error-message">❌ {error}</p>}

                <button type="submit" disabled={exito || cargando}>
                    {cargando ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>

            <p className="login-link">
                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    );
}

export default Registrar;