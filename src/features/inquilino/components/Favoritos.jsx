import React, { useState, useEffect } from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import { obtenerFavoritos } from "../services/favoritosService";
import { obtenerPropiedadesDisponibles } from "../../inmuebles/services/inmueblesService";
import { useFetch } from "../../../shared/hooks/useFetch";

export default function Favoritos() {
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

  // Extraer y filtrar array
  let todas = Array.isArray(respuesta) ? respuesta : respuesta?.propiedades || respuesta?.data || [];
  const favoritos = todas.filter((prop) => idsFavoritos.includes(String(prop?.id)));

  const cantidad = favoritos.length;
  const subtitulo = `${cantidad} ${cantidad === 1 ? "propiedad guardada" : "propiedades guardadas"}`;

  return (
    <SeccionPropiedades
      titulo="Mis Favoritos"
      subtitulo={subtitulo}
      propiedades={favoritos}
      cargando={cargando}
      error={error}
      textoCargando="Cargando favoritos..."
      vacio={{
        titulo: "Aún no tenés favoritos guardados",
        texto: "Explorá el catálogo de propiedades y presioná el ícono de corazón para guardarlas acá.",
        linkTo: "/inmuebles",
        linkTexto: "Explorar Propiedades",
      }}
    />
  );
}