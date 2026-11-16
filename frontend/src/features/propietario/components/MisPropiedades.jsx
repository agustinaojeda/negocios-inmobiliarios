import React, { useState } from "react";
import { useMisPropiedades } from "../hooks/useMisPropiedades.js";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades.jsx";
import ModalDetalleCita from "../../../shared/components/citas/ModalDetalleCita.jsx";
import FiltroPills from "../../inmuebles/components/FiltroPills.jsx";
import ModalHistorialPrecios from "../../inmuebles/components/ModalHistorialPrecios.jsx";
import {
  obtenerHistorialPrecios,
  mensajeErrorHistorial,
} from "../../inmuebles/services/inmueblesService.js";

export default function MisPropiedades({ propietarioId = null }) {
  const [subVista, setSubVista] = useState("inmuebles"); // 'inmuebles' | 'citas'

  const {
    propiedades,
    citas,
    cargando,
    error,
    errorCitas,
    filtroEstadoProp,
    setFiltroEstadoProp,
    filtroEstadoCita,
    setFiltroEstadoCita,
  } = useMisPropiedades(propietarioId);

  const [citaDetalleId, setCitaDetalleId] = useState(null);

  const [propiedadHistorial, setPropiedadHistorial] = useState(null);
  const [datosHistorial, setDatosHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(null);

  const abrirHistorial = async (propiedad) => {
    setPropiedadHistorial(propiedad);
    setDatosHistorial(null);
    setErrorHistorial(null);
    setCargandoHistorial(true);

    try {
      const datos = await obtenerHistorialPrecios(propiedad.id);
      setDatosHistorial(datos);
    } catch (err) {
      setErrorHistorial(mensajeErrorHistorial(err));
    } finally {
      setCargandoHistorial(false);
    }
  };

  const cerrarHistorial = () => {
    setPropiedadHistorial(null);
    setDatosHistorial(null);
    setErrorHistorial(null);
    setCargandoHistorial(false);
  };

  const opcionesEstadoInmueble = ["todas", "venta", "alquiler"];
  const opcionesEstadoCita = ["todas", "pendiente", "confirmada", "completada", "cancelada"];

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
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
          renderAccion={(propiedad) => (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={() => abrirHistorial(propiedad)}
            >
              Ver historial de precios
            </button>
          )}
        >
          <FiltroPills
            titulo="Filtrar por estado del inmueble:"
            opciones={opcionesEstadoInmueble}
            seleccionado={filtroEstadoProp}
            onSeleccionar={setFiltroEstadoProp}
          />
        </SeccionPropiedades>
      )}

      {/* Modal historial de precios */}
      <ModalHistorialPrecios
        mostrar={Boolean(propiedadHistorial)}
        onCerrar={cerrarHistorial}
        propiedad={propiedadHistorial}
        historial={datosHistorial?.historial}
        precioActual={datosHistorial?.precio_actual}
        cargando={cargandoHistorial}
        error={errorHistorial}
        onReintentar={() => abrirHistorial(propiedadHistorial)}
      />

      {/* CITAS RECIBIDAS */}
      {subVista === "citas" && (
        <SeccionPropiedades
          titulo="Citas de Visita Recibidas"
          subtitulo="Información sobre las solicitudes de visita, clientes interesados y el asesor asignado"
          citas={citas}
          cargando={cargando}
          error={errorCitas}
          vacio={{
            titulo: "Sin citas registradas",
            texto: "No hay visitas para mostrar con el estado seleccionado.",
          }}
          renderAccion={(cita) => (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              onClick={() => setCitaDetalleId(cita.id)}
            >
              Ver detalle
            </button>
          )}
        >
          <FiltroPills
            titulo="Filtrar por estado de la cita:"
            opciones={opcionesEstadoCita}
            seleccionado={filtroEstadoCita}
            onSeleccionar={setFiltroEstadoCita}
          />
        </SeccionPropiedades>
      )}

      <ModalDetalleCita
        mostrar={citaDetalleId !== null}
        citaId={citaDetalleId}
        onCerrar={() => setCitaDetalleId(null)}
      />
    </div>
  );
}