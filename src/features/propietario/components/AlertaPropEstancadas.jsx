import React from "react";
import { Link } from "react-router";

export default function AlertaPropiedadesEstancadas({ estancadas = [], diasLimite = 60 }) {
  if (!estancadas || estancadas.length === 0) return null;

  return (
    <div className="alert alert-warning border-0 shadow-sm rounded-3 mb-4 p-3 p-md-4" role="alert">
      <div className="d-flex align-items-start gap-3">
        <div className="flex-grow-1">
          <h5 className="alert-heading fw-bold mb-1">
            Atención: {estancadas.length} {estancadas.length === 1 ? "propiedad lleva" : "propiedades llevan"} más de {diasLimite} días sin concretarse
          </h5>
          <p className="mb-2 text-dark small">
            Las propiedades con mucho tiempo publicadas suelen beneficiarse de una revisión de precio o estrategia con tu asesor asignado.
          </p>

          <div className="d-flex flex-wrap gap-2 mt-2">
            {estancadas.map((prop) => (
              <div key={prop.id} className="badge bg-white text-dark border p-2 fw-normal d-flex align-items-center gap-2">
                <Link to={`/inmueble/${prop.id}`} className="text-decoration-none h-100 d-block">
                <strong>{prop.titulo}</strong>
                <span className="text-danger fw-bold"> ({prop.diasPublicada} días)</span>
                <span className="text-muted"> | Agente: {prop.agenteNombre}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}