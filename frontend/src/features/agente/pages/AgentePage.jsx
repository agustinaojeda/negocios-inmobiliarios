import { useOutletContext } from 'react-router'
import CarteraInmuebles from '../components/CarteraInmuebles'
import AgendaVisitas from '../components/AgendaVisitas'
import InformacionContacto from '../../../shared/components/panel/InfoContacto'
import Seguridad from '../../../shared/components/panel/Seguridad'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import { useFetch } from '../../../shared/hooks/useFetch'
import { obtenerMetricasDashboard } from '../../admin/services/adminService'

// Vista de métricas comerciales personalizadas para el agente
function DashboardAgente() {
  const { datos: metricas, cargando, error } = useFetch(obtenerMetricasDashboard)

  if (cargando) return <Spinner texto="Cargando métricas de tu actividad..." />
  if (error) return <MensajeVacio titulo="Error al cargar métricas" texto={error.message} />

  const { inmuebles, operaciones, citas, kpis, inmueblesEstancados } = metricas || {}

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
        Mi Rendimiento Comercial
      </h2>
      <p className="text-muted small mb-4">
        Resumen de captaciones, ventas cerradas y efectividad de visitas.
      </p>

      {/* Grid de KPIs del Agente */}
      <div className="row g-3">
        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Propiedades en Cartera</div>
            <div className="h4 fw-bold mb-0 text-dark">{inmuebles?.inmuebles_activos ?? 0}</div>
            <div className="small text-muted mt-1">
              {inmuebles?.inmuebles_inactivos ?? 0} cerradas o inactivas
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Mis Operaciones Cerradas</div>
            <div className="h4 fw-bold mb-0 text-dark">{operaciones?.total_operaciones ?? 0}</div>
            <div className="small text-muted mt-1">Ventas y contratos concretados</div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Volumen Transaccionado</div>
            <div className="h4 fw-bold mb-0 text-success">
              USD {Number(operaciones?.volumen_usd || 0).toLocaleString('es-AR')}
            </div>
            <div className="small text-muted mt-1">Monto total comercializado</div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Agenda de Visitas</div>
            <div className="h4 fw-bold mb-0 text-dark">{citas?.total_citas ?? 0}</div>
            <div className="small text-muted mt-1">
              <span className="text-primary">{citas?.citas_pendientes ?? 0} pendientes</span>
              {citas?.citas_vencidas > 0 && (
                <span className="text-danger ms-2">({citas.citas_vencidas} vencidas)</span>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Tasa de Conversión</div>
            <div className="h4 fw-bold mb-0 text-dark">{kpis?.tasaConversion ?? 0}%</div>
            <div className="small text-muted mt-1">Visitas convertidas en operaciones</div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Sin Actividad Reciente</div>
            <div className={`h4 fw-bold mb-0 ${kpis?.inmueblesEstancadosCount > 0 ? 'text-warning' : 'text-dark'}`}>
              {kpis?.inmueblesEstancadosCount ?? 0}
            </div>
            <div className="small text-muted mt-1">+30 días sin visitas registradas</div>
          </div>
        </div>
      </div>

      {/* Listado de Inmuebles sin actividad reciente (+30 días) */}
      {inmueblesEstancados && inmueblesEstancados.length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="h6 fw-bold mb-0" style={{ color: '#13284c' }}>
              Atención Comercial: Inmuebles sin visitas recientes
            </h3>
            <span className="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle px-3 py-1 small">
              Requieren seguimiento
            </span>
          </div>
          <p className="text-muted small mb-3">
            Propiedades con más de 30 días activas que no han tenido solicitudes de visita. Oportunidad para renovar precio o fotos.
          </p>

          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th scope="col" className="border-0">Propiedad</th>
                  <th scope="col" className="border-0">Zona</th>
                  <th scope="col" className="border-0">Precio</th>
                  <th scope="col" className="border-0 text-end">Tiempo activa</th>
                </tr>
              </thead>
              <tbody>
                {inmueblesEstancados.map((item) => (
                  <tr key={item.id}>
                    <td className="small fw-semibold text-dark">{item.titulo}</td>
                    <td className="small text-muted">{item.zona}</td>
                    <td className="small text-dark">
                      {item.moneda} {Number(item.precio).toLocaleString('es-AR')}
                    </td>
                    <td className="small text-end">
                      <span className="badge rounded-pill bg-light text-danger border">
                        {item.dias_publicada} días
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AgentePage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'dashboard' && <DashboardAgente />}

      {seccionActiva === 'cartera' && (
        <CarteraInmuebles agenteId={sesion?.id} />
      )}

      {seccionActiva === 'citas' && (
        <AgendaVisitas agenteId={sesion?.id} />
      )}

      {seccionActiva === 'consultas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Consultas y Mensajes Directos
          </h2>
          <p className="text-muted">
            Mensajes recibidos desde las fichas comerciales de tus propiedades publicadas.
          </p>
          <div className="alert alert-light border rounded-3 text-muted small mt-2">
            No tenés nuevas consultas sin responder en este momento.
          </div>
        </div>
      )}

      {seccionActiva === 'perfil' && (
        <InformacionContacto />
      )}

      {seccionActiva === 'seguridad' && (
        <Seguridad />
      )}
    </div>
  )
}
