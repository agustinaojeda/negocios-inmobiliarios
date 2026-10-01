import React, { useState } from "react";
import { useMisPropiedades } from "../hooks/useMisPropiedades.js";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import FiltroPills from "../../inmuebles/components/FiltroPills";

export default function MisPropiedades({ propietarioId = null }) {
  const [subVista, setSubVista] = useState("inmuebles"); // 'inmuebles' | 'citas'

  const {
    propiedades,
    citas,
    cargando,
    error,
    filtroEstadoProp,
    setFiltroEstadoProp,
    filtroEstadoCita,
    setFiltroEstadoCita,
  } = useMisPropiedades(propietarioId);

  const opcionesEstadoInmueble = ["todas", "disponible", "reservado", "alquilado", "vendido"];
  const opcionesEstadoCita = ["todas", "pendiente", "confirmada", "completada", "cancelada"];

  return (
    <div className="mis-propiedades-container">
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group bg-light p-1 rounded-pill shadow-sm" role="group">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 fw-semibold ${
              subVista === "inmuebles" ? "btn-primary shadow-sm" : "btn-light text-muted"
            }`}
            onClick={() => setSubVista("inmuebles")}
          >
            Mis Inmuebles ({propiedades.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-4 fw-semibold ${
              subVista === "citas" ? "btn-primary shadow-sm" : "btn-light text-muted"
            }`}
            onClick={() => setSubVista("citas")}
          >
            Citas de Visita ({citas.length})
          </button>
        </div>
      </div>

      {/* MIS INMUEBLES */}
      {subVista === "inmuebles" && (
        <SeccionPropiedades
          titulo="Inmuebles Publicados"
          subtitulo="Estado y seguimiento de tus propiedades ingresadas en el sistema"
          propiedades={propiedades}
          cargando={cargando}
          error={error}
          vacio={{
            titulo: "No hay propiedades en este estado",
            texto: "Probá cambiando la opción seleccionada en los filtros.",
          }}
        >
          <FiltroPills
            titulo="Filtrar por estado del inmueble:"
            opciones={opcionesEstadoInmueble}
            seleccionado={filtroEstadoProp}
            onSeleccionar={setFiltroEstadoProp}
          />
        </SeccionPropiedades>
      )}

      {/* CITAS RECIBIDAS */}
      {subVista === "citas" && (
        <SeccionPropiedades
          titulo="Citas de Visita Recibidas"
          subtitulo="Información sobre las solicitudes de visita, clientes interesados y el asesor asignado"
          citas={citas}
          cargando={cargando}
          error={error}
          vacio={{
            titulo: "Sin citas registradas",
            texto: "No hay visitas para mostrar con el estado seleccionado.",
          }}
        >
          <FiltroPills
            titulo="Filtrar por estado de la cita:"
            opciones={opcionesEstadoCita}
            seleccionado={filtroEstadoCita}
            onSeleccionar={setFiltroEstadoCita}
          />
        </SeccionPropiedades>
      )}
    </div>
  );
}