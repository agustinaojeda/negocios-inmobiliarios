import { useState, useEffect } from "react";
import { obtenerFavoritos } from "../services/favoritosService";
import { obtenerPropiedadesDisponibles } from "../../inmuebles/services/inmueblesService";
import { useFetch } from "../../../shared/hooks/useFetch";

export function useFavoritos() {
  const { datos: respuesta = [], cargando, error } = useFetch(obtenerPropiedadesDisponibles);
  const [idsFavoritos, setIdsFavoritos] = useState([]);

  const actualizarIds = () => {
    const ids = (obtenerFavoritos() || []).map((id) => String(id));
    setIdsFavoritos(ids);
  };

  useEffect(() => {
    actualizarIds();
    window.addEventListener("favoritosUpdated", actualizarIds);
    return () => window.removeEventListener("favoritosUpdated", actualizarIds);
  }, []);

  const todas = Array.isArray(respuesta) ? respuesta : respuesta?.propiedades || respuesta?.data || [];
  const favoritos = todas.filter((prop) => idsFavoritos.includes(String(prop?.id)));

  return {
    favoritos,
    cantidad: favoritos.length,
    cargando,
    error,
  };
}