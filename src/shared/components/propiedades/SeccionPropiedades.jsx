import React from "react";
import { Link } from "react-router";
import GrillaPropiedades from "../../../shared/components/propiedades/GrillaPropiedades";
import MensajeVacio from "../../../shared/components/MensajeVacio";
import Spinner from "../../../shared/components/Spinner";

export default function SeccionPropiedades({
  titulo,
  subtitulo,
  propiedades,
  citas,
  esAsignado = false,
  cargando = false,
  error = null,
  textoCargando = "Cargando...",
  vacio = {
    titulo: "No hay propiedades",
    texto: "Explorá el catálogo para encontrar opciones.",
    linkTo: "/inmuebles",
    linkTexto: "Explorar Propiedades",
  },
  children, // para poner los filtros
}) {
  const lista = citas || propiedades || [];

  if (cargando) return <Spinner texto={textoCargando} />;

  if (error)
    return (
      <MensajeVacio
        titulo="No pudimos cargar la información"
        texto={error.message || error}
      />
    );

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
          {titulo}
        </h2>
        {subtitulo && <p className="text-muted small mb-0">{subtitulo}</p>}
      </div>

      {children}

      {/* Contenido */}
      {lista.length > 0 ? (
        <GrillaPropiedades
          propiedades={propiedades}
          citas={citas}
          esAsignado={esAsignado} 
        />
      ) : (
        <MensajeVacio titulo={vacio.titulo} texto={vacio.texto}>
          {vacio.linkTo && (
            <Link
              to={vacio.linkTo}
              className="btn btn-sm btn-primary rounded-pill px-4"
            >
              {vacio.linkTexto}
            </Link>
          )}
        </MensajeVacio>
      )}
    </div>
  );
}