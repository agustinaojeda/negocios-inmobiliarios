import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { formatearPrecio } from '../../../shared/utils/formato'
import { obtenerMetricasDesempeno } from '../services/agenteService'
import { useFetch } from '../../../shared/hooks/useFetch'

export default function DesempenoAgente({ agenteId }) {
  const { datos: metricas, cargando, error } = useFetch(obtenerMetricasDesempeno, agenteId)

  if (cargando) return <Spinner texto="Calculando métricas de desempeño comercial..." />
  if (error) return <MensajeVacio titulo="Error en métricas" texto={error} />
  if (!metricas) return null

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
              Dashboard de Desempeño Comercial
            </h2>
            <p className="text-muted small mb-0">
              Métricas clave de captaciones, efectividad de cierres y gestión de visitas.
            </p>
          </div>
          <div className="badge rounded-pill px-3 py-2 bg-light text-dark border">
            Tasa de Cierre: <strong className="text-success ms-1">{metricas.tasaConversion}%</strong>
          </div>
        </div>

        {/* Tarjetas Principales de KPI */}
        <div className="row g-3 mt-3">
          {/* Inmuebles Activos */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-3 rounded-4 bg-light border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted fw-medium">Cartera Activa</span>
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small">
                  Disponibles
                </span>
              </div>
              <div className="h3 fw-bold mb-0 text-dark">{metricas.disponibles}</div>
              <small className="text-muted">de {metricas.totalPropiedades} en cartera</small>
            </div>
          </div>

          {/* Operaciones Cerradas */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-3 rounded-4 bg-light border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted fw-medium">Cierres Realizados</span>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 small">
                  Vendido / Alq.
                </span>
              </div>
              <div className="h3 fw-bold mb-0 text-primary">{metricas.cerradas}</div>
              <small className="text-muted">{metricas.reservadas} actualmente en reserva</small>
            </div>
          </div>

          {/* Visitas Gestionadas */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-3 rounded-4 bg-light border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted fw-medium">Visitas de Agenda</span>
                <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-2 py-1 small">
                  Confirmadas
                </span>
              </div>
              <div className="h3 fw-bold mb-0 text-dark">{metricas.citasConfirmadas}</div>
              <small className="text-warning fw-medium">
                {metricas.citasPendientes} pendientes de responder
              </small>
            </div>
          </div>

          {/* Volumen Total Gestionado */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-3 rounded-4 bg-light border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted fw-medium">Volumen Total</span>
                <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1 small">
                  Cartera
                </span>
              </div>
              <div className="h4 fw-bold mb-0 text-dark text-truncate" title={formatearPrecio(metricas.volumenCartera)}>
                {formatearPrecio(metricas.volumenCartera)}
              </div>
              <small className="text-muted">en propiedades asignadas</small>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Cartera y Pipeline */}
      <div className="row g-4">
        {/* Distribución por tipo de inmueble */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h3 className="h6 fw-bold mb-3" style={{ color: '#13284c' }}>
              Composición de Cartera por Tipo
            </h3>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Departamentos</span>
                  <strong>{metricas.propiedadesPorTipo.deptos}</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${metricas.totalPropiedades ? (metricas.propiedadesPorTipo.deptos / metricas.totalPropiedades) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Casas y Chalets</span>
                  <strong>{metricas.propiedadesPorTipo.casas}</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${metricas.totalPropiedades ? (metricas.propiedadesPorTipo.casas / metricas.totalPropiedades) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>PHs y Dúplex</span>
                  <strong>{metricas.propiedadesPorTipo.phs}</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-warning"
                    style={{
                      width: `${metricas.totalPropiedades ? (metricas.propiedadesPorTipo.phs / metricas.totalPropiedades) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Otros (Locales / Terrenos)</span>
                  <strong>{metricas.propiedadesPorTipo.otros}</strong>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-secondary"
                    style={{
                      width: `${metricas.totalPropiedades ? (metricas.propiedadesPorTipo.otros / metricas.totalPropiedades) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Efectividad y Agenda */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h3 className="h6 fw-bold mb-3" style={{ color: '#13284c' }}>
              Embudo Comercial & Visitas
            </h3>
            <div className="list-group list-group-flush small">
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="text-muted">Visitas concretadas / realizadas:</span>
                <span className="badge bg-success rounded-pill px-3">{metricas.citasCompletadas}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="text-muted">Visitas confirmadas programadas:</span>
                <span className="badge bg-primary rounded-pill px-3">{metricas.citasConfirmadas}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="text-muted">Solicitudes por responder:</span>
                <span className="badge bg-warning text-dark rounded-pill px-3">{metricas.citasPendientes}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span className="text-muted">Propiedades en estado Reservado:</span>
                <span className="badge bg-info text-dark rounded-pill px-3">{metricas.reservadas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
