import { useState, useEffect } from "react";
import { obtenerFavoritos } from "../services/favoritosService";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarFavoritos = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerFavoritos();
      setFavoritos(datos);

    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      setError(err.message || "No se pudieron obtener los favoritos");

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarFavoritos();
    //para escuchar si el usuario agrega o quita alguno
    window.addEventListener("favoritosUpdated", cargarFavoritos);
    return () => window.removeEventListener("favoritosUpdated", cargarFavoritos);
  }, []);

  return {
    favoritos,
    cantidad: favoritos.length,
    cargando,
    error,
  };
}