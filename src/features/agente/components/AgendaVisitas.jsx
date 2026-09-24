import { useState, useEffect, useMemo } from 'react'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Toast from '../../../shared/components/Toast'
import {
  obtenerCitasAgente,
  actualizarEstadoCita,
} from '../services/agenteService'

const FILTROS_CITAS = [
  { id: 'todas', label: 'Todas las Visitas' },
  { id: 'pendiente', label: 'Pendientes de Aprobación' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'completada', label: 'Completadas' },
  { id: 'cancelada', label: 'Canceladas / Rechazadas' },
]

export default function AgendaVisitas({ agenteId }) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todas')
  const [mensajeToast, setMensajeToast] = useState('')

  const mostrarNotificacion = (texto) => {
    setMensajeToast(texto)
    setTimeout(() => {
      setMensajeToast('')
    }, 3500)
  }

  const cargarCitas = async () => {
    try {
      setCargando(true)
      setError(null)
      const data = await obtenerCitasAgente(agenteId)
      setCitas(data)
    } catch (err) {
      console.error('Error al cargar agenda:', err)
      setError(err.message || 'No se pudieron cargar las citas de la agenda')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [agenteId])

  const handleCambiarEstado = async (citaId, nuevoEstado, mensajeExito) => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado)
      setCitas((prev) =>
        prev.map((c) => (String(c.id) === String(citaId) ? { ...c, estado: nuevoEstado } : c))
      )
      mostrarNotificacion(mensajeExito)
    } catch (err) {
      console.error('Error al actualizar cita:', err)
      mostrarNotificacion('Error al actualizar el estado de la visita')
    }
  }

  const citasFiltradas = useMemo(() => {
    if (filtro === 'todas') return citas
    return citas.filter((c) => c.estado === filtro)
  }, [citas, filtro])

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return <span className="badge bg-success rounded-pill px-3 py-1">Confirmada</span>
      case 'pendiente':
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-1">Pendiente</span>
      case 'completada':
        return <span className="badge bg-info text-dark rounded-pill px-3 py-1">Realizada</span>
      case 'cancelada':
        return <span className="badge bg-danger rounded-pill px-3 py-1">Rechazada / Cancelada</span>
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-1">{estado}</span>
    }
  }

  if (cargando) return <Spinner texto="Cargando agenda de citas y visitas..." />
  if (error) return <MensajeVacio titulo="Error en la agenda" texto={error} />

  const pendientesCont = citas.filter((c) => c.estado === 'pendiente').length

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
      <Toast mensaje={mensajeToast} />

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="h5 fw-bold mb-0" style={{ color: '#13284c' }}>
              Agenda de Visitas y Citas
            </h2>
            {pendientesCont > 0 && (
              <span className="badge rounded-pill bg-warning text-dark px-2 py-1 small">
                {pendientesCont} por responder
              </span>
            )}
          </div>
          <p className="text-muted small mb-0 mt-1">
            Revisá las solicitudes de visita de clientes, aprobalas o recházalas para organizar tu semana.
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="d-flex flex-wrap gap-1">
          {FILTROS_CITAS.map((f) => (
            <button
              key={f.id}
              className={`btn btn-sm rounded-pill px-3 fw-medium transition-all ${
                filtro === f.id
                  ? 'btn-dark'
                  : 'btn-outline-secondary border-0 bg-light text-secondary'
              }`}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarjetas de Cita */}
      {citasFiltradas.length > 0 ? (
        <div className="row g-3">
          {citasFiltradas.map((c) => (
            <div className="col-12" key={c.id}>
              <div className="p-3 rounded-4 border bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                {/* Info Inmueble y Cliente */}
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={c.propiedadImg || '/img/propiedades/prop1.jpg'}
                    alt={c.propiedadTitulo}
                    className="rounded-3 object-fit-cover border shadow-sm"
                    style={{ width: '65px', height: '65px' }}
                    onError={(e) => {
                      e.target.src = '/img/propiedades/prop1.jpg'
                    }}
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-dark">{c.propiedadTitulo}</span>
                      {getBadgeEstado(c.estado)}
                    </div>
                    <div className="small text-muted mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="me-1 text-primary"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <strong>{c.fecha || 'Fecha por confirmar'}</strong> a las{' '}
                      <strong>{c.hora || '10:00'} hs</strong>
                    </div>
                    <div className="small text-secondary">
                      <span>Interesado: <strong>{c.clienteNombre}</strong></span>
                      {c.clienteTelefono && <span className="ms-2">• Tel: {c.clienteTelefono}</span>}
                      {c.clienteEmail && <span className="ms-2">• Email: {c.clienteEmail}</span>}
                    </div>
                  </div>
                </div>

                {/* Botones de Aprobación / Rechazo */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {c.estado === 'pendiente' && (
                    <>
                      <button
                        className="btn btn-sm btn-success rounded-pill px-3 fw-medium d-flex align-items-center gap-1 shadow-sm"
                        onClick={() =>
                          handleCambiarEstado(c.id, 'confirmada', '¡Visita aprobada y confirmada!')
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                        </svg>
                        Aprobar Visita
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-medium"
                        onClick={() =>
                          handleCambiarEstado(c.id, 'cancelada', 'Visita rechazada.')
                        }
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {c.estado === 'confirmada' && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium"
                        onClick={() =>
                          handleCambiarEstado(c.id, 'completada', 'Visita marcada como realizada.')
                        }
                      >
                        Marcar como Realizada
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() =>
                          handleCambiarEstado(c.id, 'cancelada', 'Visita cancelada.')
                        }
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {(c.estado === 'completada' || c.estado === 'cancelada') && (
                    <button
                      className="btn btn-sm btn-light border rounded-pill px-3 text-secondary"
                      onClick={() =>
                        handleCambiarEstado(c.id, 'pendiente', 'Visita reabierta a pendiente.')
                      }
                    >
                      Reabrir Solicitud
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <MensajeVacio
          titulo="No hay visitas en este filtro"
          texto={
            filtro === 'todas'
              ? 'Aún no tenés solicitudes de visita programadas.'
              : `No se encontraron visitas con estado "${filtro}".`
          }
        />
      )}
    </div>
  )
}
