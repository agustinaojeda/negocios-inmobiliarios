import React from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import FiltroPills from "../../inmuebles/components/FiltroPills";
import { useMisCitas } from "../hooks/useCitas";
import "./filtro-compacto.css";

export default function Citas() {
  const { citas, usuario, estadoFiltro, setEstadoFiltro, cargando, error } = useMisCitas();

  return (
    <SeccionPropiedades
      titulo="Mis Citas Agendadas"
      subtitulo={usuario ? `Viendo citas de ${usuario.nombre}` : "Gestioná tus visitas a inmuebles"}
      citas={citas}
      cargando={cargando}
      error={error}
      textoCargando="Cargando tus citas..."
      vacio={{
        titulo:
          estadoFiltro === "todas"
            ? "No tenés citas agendadas"
            : `No tenés citas en estado "${estadoFiltro}"`,
        texto: "Explorá las propiedades disponibles y coordiná una visita.",
        linkTo: "/inmuebles",
        linkTexto: "Ver propiedades disponibles",
      }}
    >
      <div className="filtro-compacto mb-4">
        <FiltroPills
          titulo="Filtrar por estado:"
          opciones={["todas", "pendiente", "confirmada", "completada", "cancelada"]}
          seleccionado={estadoFiltro}
          onSeleccionar={setEstadoFiltro}
        />
      </div>
    </SeccionPropiedades>
  );
}