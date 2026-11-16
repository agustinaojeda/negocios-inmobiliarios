import { useState } from 'react'
import { useOutletContext } from 'react-router'
import GestionUsuarios from '../components/GestionUsuarios'
import GestionInmuebles from '../components/GestionInmuebles'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import TablaOperaciones from '../../../shared/components/operaciones/TablaOperaciones'
import ModalDetalleOperacion from '../../../shared/components/operaciones/ModalDetalleOperacion'
import { useFetch } from '../../../shared/hooks/useFetch'
import { obtenerMetricasDashboard, obtenerOperaciones } from '../services/adminService'

// Vista del Dashboard con métricas y KPIs 
function SeccionDashboard() {
  const { datos: metricas, cargando, error } = useFetch(obtenerMetricasDashboard)

  if (cargando) return <Spinner texto="Cargando métricas del sistema..." />
  if (error) return <MensajeVacio titulo="Error al cargar métricas" texto={error.message} />

  const { usuarios, inmuebles, operaciones, citas, kpis, ventasPorAgente } = metricas || {}

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
        Panel de Control General
      </h2>
      <p className="text-muted small mb-4">
        Resumen global de actividad, ingresos y operaciones en la plataforma.
      </p>

      {/* Grid de KPIs principales */}
      <div className="row g-3">
        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Usuarios Registrados</div>
            <div className="h4 fw-bold mb-0 text-dark">{usuarios?.total_usuarios ?? 0}</div>
            <div className="small text-muted mt-1">
              {usuarios?.agentes_operativos ?? 0} agentes activos
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Inmuebles en Cartera</div>
            <div className="h4 fw-bold mb-0 text-dark">{inmuebles?.inmuebles_activos ?? 0}</div>
            <div className="small text-muted mt-1">
              {inmuebles?.inmuebles_inactivos ?? 0} fuera de catálogo / cerrados
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Operaciones Cerradas</div>
            <div className="h4 fw-bold mb-0 text-dark">{operaciones?.total_operaciones ?? 0}</div>
            <div className="small text-muted mt-1">Ventas y contratos formalizados</div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Volumen Transaccionado</div>
            <div className="h4 fw-bold mb-0 text-success">
              USD {Number(operaciones?.volumen_usd || 0).toLocaleString('es-AR')}
            </div>
            <div className="small text-muted mt-1">Monto total de ventas</div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="p-3 rounded-4 bg-light border-0 h-100">
            <div className="small text-muted mb-1">Citas y Visitas</div>
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
            <div className="small text-muted mt-1">Visitas convertidas en cierres</div>
          </div>
        </div>
      </div>

      {/* Rendimiento Comercial por Agente */}
      {ventasPorAgente && ventasPorAgente.length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <h3 className="h6 fw-bold mb-3" style={{ color: '#13284c' }}>
            Rendimiento Comercial por Agente
          </h3>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th scope="col" className="border-0">Agente</th>
                  <th scope="col" className="border-0 text-center">Operaciones</th>
                  <th scope="col" className="border-0 text-end">Volumen Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasPorAgente.map((ag) => (
                  <tr key={ag.agente_id}>
                    <td className="small fw-medium text-dark">{ag.agente_nombre}</td>
                    <td className="small text-center">
                      <span className="badge rounded-pill bg-light text-dark border">
                        {ag.operaciones_cerradas}
                      </span>
                    </td>
                    <td className="small fw-semibold text-end text-dark">
                      USD {Number(ag.volumen_total).toLocaleString('es-AR')}
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

// Vista del registro de contratos y operaciones formalizadas
function SeccionContratos() {
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null)
  const { datos: operacionesCargadas, cargando, error } = useFetch(obtenerOperaciones)
  const operaciones = operacionesCargadas || []

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
            Contratos y Operaciones
          </h2>
          <p className="text-muted small mb-0">
            Control de operaciones de venta y contratos de alquiler formalizados.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
            Total: {operaciones.length}
          </span>
        </div>
      </div>

      {cargando ? (
        <Spinner texto="Cargando operaciones..." />
      ) : error ? (
        <MensajeVacio titulo="Error al cargar contratos" texto={error.message} />
      ) : operaciones.length === 0 ? (
        <MensajeVacio
          titulo="Sin operaciones"
          texto="Aún no se han registrado operaciones comerciales en la plataforma."
        />
      ) : (
        <TablaOperaciones
          operaciones={operaciones}
          onVerDetalle={setOperacionSeleccionada}
        />
      )}

      <ModalDetalleOperacion
        mostrar={operacionSeleccionada !== null}
        operacionId={operacionSeleccionada}
        onCerrar={() => setOperacionSeleccionada(null)}
      />
    </div>
  )
}

export default function AdminPage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'dashboard' && <SeccionDashboard />}

      {seccionActiva === 'usuarios' && <GestionUsuarios />}

      {seccionActiva === 'inmuebles' && <GestionInmuebles />}

      {seccionActiva === 'contratos' && <SeccionContratos />}

      {seccionActiva === 'configuracion' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Configuración del Sistema
          </h2>
          <p className="text-muted">
            Parámetros de la plataforma, comisiones y configuración general.
          </p>
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#f8fafc' }}>
            <p className="mb-1">
              <strong>Administrador actual:</strong> {sesion?.nombre || 'Admin'}
            </p>
            <p className="mb-0">
              <strong>Email:</strong> {sesion?.email || 'admin@ejemplo.com'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
