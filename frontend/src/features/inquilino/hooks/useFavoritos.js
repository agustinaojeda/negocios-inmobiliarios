import { useState, useEffect } from "react";
import { obtenerFavoritos } from "../services/favoritosService";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarFavoritos = async (mostrarSpinner= false) => {
    try {
      if (mostrarSpinner) setCargando(true);
      setError(null);
      const datos = await obtenerFavoritos();
      setFavoritos(datos);

    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      setError(err.message || "No se pudieron obtener los favoritos");

    } finally {
      if (mostrarSpinner) setCargando(false);
    }
  };

  useEffect(() => {
    cargarFavoritos(true);

    //para escuchar si el usuario agrega o quita alguno
    const alActualizar = () => cargarFavoritos(false);
    window.addEventListener("favoritosUpdated", alActualizar);
    return () => window.removeEventListener("favoritosUpdated", alActualizar);
  }, []);

  return {
    favoritos,
    cantidad: favoritos.length,
    cargando,
    error,
  };
}