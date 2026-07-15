import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config/apiConfig";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '../context/AuthContext';
import ListaLibros from '../components/ListaLibros';

function GestionLibros() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [succesMsg, setSuccesMsg] = useState('');
    const [listaLibros, setListaLibros] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    const cargarLibros = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/libros`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("No se pudo obtener la lista de libros");
            }

            const datos = await response.json();
            setListaLibros(datos);
        } catch (error) {
            setErrorMsg(error.message);
        }
    }, [token]);

    useEffect(() => {
        cargarLibros();
    }, [cargarLibros]);

    
    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccesMsg("");

        if (!archivo) {
            setErrorMsg("Debe seleccionar una foto del libro");
            return;
        }

        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("titulo", titulo);
        formData.append("autor", autor);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/libros/registrar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("No se pudo registrar el libro");
            }

            setSuccesMsg("Libro registrado con éxito");
            setTitulo("");
            setAutor("");
            setArchivo(null);
            cargarLibros();
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    
    const manejarLibroEliminado = (id) => {
        setListaLibros(prev => prev.filter(l => l.id !== id));
        setSuccesMsg("Libro eliminado con éxito");
    };

    
    const manejarLibroActualizado = () => {
        cargarLibros();
        setSuccesMsg("Libro actualizado con éxito");
    };

    return (
        <div className="gestion-container">
            <button onClick={() => navigate('/perfil')} className="btn-back">
                ← Volver al Perfil
            </button>
            <h1>📖 Gestión de Libros</h1>

            
            <div className="form-container">
                <h2>Registrar nuevo libro</h2>
                <form onSubmit={manejarSubmit}>
                    <div className="form-group">
                        <label>Título:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Ej: Cien años de soledad"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Autor:</label>
                        <input
                            type="text"
                            value={autor}
                            onChange={(e) => setAutor(e.target.value)}
                            placeholder="Ej: Gabriel García Márquez"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Foto de portada:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setArchivo(e.target.files[0])}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-register">
                        📚 Registrar Libro
                    </button>
                </form>
            </div>

            
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {succesMsg && <p className="success-message">{succesMsg}</p>}

            
            <ListaLibros
                libros={listaLibros}
                onLibroEliminado={manejarLibroEliminado}
                onLibroActualizado={manejarLibroActualizado}
            />
        </div>
    );
}

export default GestionLibros;