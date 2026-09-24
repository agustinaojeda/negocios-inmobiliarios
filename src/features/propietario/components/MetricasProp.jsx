import React from "react";
import TarjetaMetrica from "./TarjetaMetrica";
import AlertaPropiedadesEstancadas from "./AlertaPropEstancadas";
import { useMetricasPropietario } from "../hooks/useMetricasPropietario";

export default function MetricasProp() {
  const { metricas, cargando, error } = useMetricasPropietario();

  if (cargando) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center text-muted">
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <div>Cargando métricas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!metricas) return null;

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="text-center mb-4">
        <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
          Métricas y Rendimiento
        </h2>
        <p className="text-muted small mb-0">
          Resumen general del estado de tus inmuebles y la actividad coordinada por la inmobiliaria.
        </p>
      </div>

      <AlertaPropiedadesEstancadas estancadas={metricas.estancadas} diasLimite={60} />

      <div className="row g-3">
        <TarjetaMetrica
          titulo="Mis Inmuebles"
          valor={metricas.totales}
          subtitulo="Propiedades registradas"
          colorBorde="dark"
        />
        <TarjetaMetrica
          titulo="Disponibles"
          valor={metricas.disponibles}
          subtitulo="Recibiendo consultas"
          colorBorde="primary"
        />
        <TarjetaMetrica
          titulo="Concretadas"
          valor={metricas.concretadas}
          subtitulo="Operaciones cerradas o en proceso"
          colorBorde="success"
        />
        <TarjetaMetrica
          titulo="Visitas Solicitadas"
          valor={metricas.totalCitas}
          subtitulo="Coordinadas por agentes"
          colorBorde="info"
        />
      </div>
    </div>
  );
}