import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/apiConfig";
import { useNavigate, Link } from "react-router-dom";

function ListarVehiculos({ vehiculos }) {
    const [fotosUrls, setFotosUrls] = useState({});
    const { token } = useAuth();
    useEffect(
        () => {
            const urlsCreadas = [];

            const descargarFotos = async () => {
                for (const vehiculo of vehiculos) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/auth/vehiculos/${vehiculo.id}/foto`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        if (res.ok) {
                            const blob = await res.blob();

                            const urlLocal = URL.createObjectURL(blob);

                            urlsCreadas.push(urlLocal);

                            setFotosUrls((prev) => ({
                                ...prev, [vehiculo.id]: urlLocal
                            }))
                        }

                    } catch (error) {
                        console.log("FALLO AL DESCARGAR LA FOTO: ", error)
                    }
                }

                if (vehiculos.length > 0) {
                    descargarFotos()
                }

                return () => {
                    for (const url of urlsCreadas) {
                        URL.revokeObjectURL(url)
                    }
                }

            }
        }, [vehiculos, token]
    );

    return (

        <div>
            <h2>Vehiculos Registrados</h2>
            {vehiculos.length === 0 ? (
                <p>No hay vehiculos registrados</p>
            ) : (
                <ul>
                    {vehiculos.map((v) => (
                        <li key={v.id}>
                            <p>Marca {v.marca}</p>
                            <p>Modelo {v.modelo}</p>
                            <p>Tipo {v.mimeType}</p>
                            {fotosUrls[v.id] && (
                                <img src={fotosUrls[v.id]} alt="Foto del vehiculo" width="150" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );

}

export default ListarVehiculos;