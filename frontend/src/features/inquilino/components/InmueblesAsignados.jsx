import React from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import { useInmueblesAsignados } from "../hooks/useInmueblesAsignados";

export default function InmueblesAsignados() {
  const { propiedades, usuario, cargando, error } = useInmueblesAsignados();

  return (
    <SeccionPropiedades
      titulo="Mis Inmuebles Asignados"
      subtitulo={
        usuario
          ? `Propiedades con contrato activo para ${usuario.nombre}`
          : "Gestioná los inmuebles asignados a tu cuenta"
      }
      propiedades={propiedades}
      esAsignado={true}
      cargando={cargando}
      error={error}
      textoCargando="Cargando tus inmuebles asignados..."
      vacio={{
        titulo: "No tenés inmuebles asignados",
        texto: "Aún no poseés contratos activos registrados a tu nombre.",
        linkTo: "/inmuebles",
        linkTexto: "Explorar catálogo",
      }}
    />
  );
}