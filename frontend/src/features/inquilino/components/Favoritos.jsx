import React from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import { useFavoritos } from "../hooks/useFavoritos";

export default function Favoritos() {
  const { favoritos, cantidad, cargando, error } = useFavoritos();

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