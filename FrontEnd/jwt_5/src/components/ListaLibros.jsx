import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/apiConfig";

function ListaLibros({ libros, onLibroEliminado, onLibroActualizado }) {
    const [fotosUrls, setFotosUrls] = useState({});
    const [editandoId, setEditandoId] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editAutor, setEditAutor] = useState('');
    const [editArchivo, setEditArchivo] = useState(null);
    const { token } = useAuth();

    
    useEffect(() => {
        const urlsCreadas = [];

        const descargarFotos = async () => {
            for (const libro of libros) {
                try {
                    const res = await fetch(`${API_BASE_URL}/auth/libros/${libro.id}/foto`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const blob = await res.blob();
                        const urlLocal = URL.createObjectURL(blob);
                        urlsCreadas.push(urlLocal);
                        setFotosUrls((prev) => ({
                            ...prev, [libro.id]: urlLocal
                        }));
                    }
                } catch (error) {
                    console.log("FALLO AL DESCARGAR LA FOTO: ", error);
                }
            }
        };

        if (libros && libros.length > 0) {
            descargarFotos();
        }

        return () => {
            for (const url of Object.values(fotosUrls)) {
                URL.revokeObjectURL(url);
            }
        };
    }, [libros, token]);

    
    const manejarEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este libro?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/libros/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el libro');
            }

            if (fotosUrls[id]) {
                URL.revokeObjectURL(fotosUrls[id]);
            }

            if (onLibroEliminado) {
                onLibroEliminado(id);
            }

        } catch (error) {
            console.log("Error al eliminar: ", error);
        }
    };

    
    const iniciarEdicion = (libro) => {
        setEditandoId(libro.id);
        setEditTitulo(libro.titulo);
        setEditAutor(libro.autor);
        setEditArchivo(null);
    };

  
    const cancelarEdicion = () => {
        setEditandoId(null);
        setEditTitulo('');
        setEditAutor('');
        setEditArchivo(null);
    };

    
    const guardarEdicion = async (id) => {
        try {
            const formData = new FormData();
            formData.append("titulo", editTitulo);
            formData.append("autor", editAutor);
            if (editArchivo) {
                formData.append("file", editArchivo);
            }

            const response = await fetch(`${API_BASE_URL}/auth/libros/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('No se pudo actualizar el libro');
            }

            if (fotosUrls[id]) {
                URL.revokeObjectURL(fotosUrls[id]);
            }

            if (onLibroActualizado) {
                onLibroActualizado();
            }

            cancelarEdicion();

        } catch (error) {
            console.log("Error al actualizar: ", error);
        }
    };

    
    return (
        <div>
            <h2>Libros Registrados</h2>
            {libros.length === 0 ? (
                <p>No hay libros registrados</p>
            ) : (
                <div className="cards-grid">
                    {libros.map((l) => (
                        <div key={l.id} className="card">
                            {editandoId === l.id ? (
                                // ===== MODO EDICIÓN =====
                                <div className="card-edit">
                                    {fotosUrls[l.id] && (
                                        <img 
                                            src={fotosUrls[l.id]} 
                                            alt="Foto del libro" 
                                            className="card-img" 
                                        />
                                    )}
                                    <input
                                        type="text"
                                        value={editTitulo}
                                        onChange={(e) => setEditTitulo(e.target.value)}
                                        placeholder="Título"
                                        className="edit-input"
                                    />
                                    <input
                                        type="text"
                                        value={editAutor}
                                        onChange={(e) => setEditAutor(e.target.value)}
                                        placeholder="Autor"
                                        className="edit-input"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditArchivo(e.target.files[0])}
                                        className="edit-file"
                                    />
                                    <div className="card-actions">
                                        <button onClick={() => guardarEdicion(l.id)} className="btn-save">
                                            💾 Guardar
                                        </button>
                                        <button onClick={cancelarEdicion} className="btn-cancel">
                                            ❌ Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // ===== MODO VISUALIZACIÓN =====
                                <>
                                    {fotosUrls[l.id] && (
                                        <img 
                                            src={fotosUrls[l.id]} 
                                            alt="Foto del libro" 
                                            className="card-img" 
                                        />
                                    )}
                                    <div className="card-body">
                                        <h3 className="card-titulo">📚 {l.titulo}</h3>
                                        <p className="card-autor">✍️ {l.autor}</p>
                                        <p className="card-tipo">{l.mimeType}</p>
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => iniciarEdicion(l)} className="btn-edit">
                                            ✏️ Editar
                                        </button>
                                        <button onClick={() => manejarEliminar(l.id)} className="btn-delete">
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListaLibros;