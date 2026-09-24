import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Toast from '../../../shared/components/Toast'
import { useAgendaVisitas } from '../hooks/useAgendaVisitas'

const FILTROS_CITAS = [
  { id: 'todas', label: 'Todas las Visitas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'completada', label: 'Completadas' },
  { id: 'cancelada', label: 'Canceladas' },
]

const BADGES_ESTADO = {
  confirmada: 'bg-success text-white',
  pendiente: 'bg-warning text-dark',
  completada: 'bg-info text-dark',
  cancelada: 'bg-danger text-white',
}

export default function AgendaVisitas({ agenteId }) {
  const {
    citasFiltradas,
    cargando,
    error,
    filtro,
    setFiltro,
    notificacion,
    pendientesCont,
    cambiarEstado,
  } = useAgendaVisitas(agenteId)

  if (cargando) return <Spinner texto="Cargando agenda de citas..." />
  if (error) return <MensajeVacio titulo="Error en la agenda" texto={error.message || error} />

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
      <Toast mensaje={notificacion} />

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
        <div className="btn-group btn-group-sm">
          {FILTROS_CITAS.map((f) => (
            <button
              key={f.id}
              className={`btn ${filtro === f.id ? 'btn-dark' : 'btn-outline-secondary'}`}
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
                    style={{ width: '55px', height: '55px' }}
                    onError={(e) => {
                      e.target.src = '/img/propiedades/prop1.jpg'
                    }}
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold text-dark">{c.propiedadTitulo}</span>
                      <span className={`badge rounded-pill px-2 py-1 small ${BADGES_ESTADO[c.estado] || 'bg-secondary text-white'}`}>
                        {c.estado}
                      </span>
                    </div>
                    <div className="small text-muted mb-1">
                      📅 <strong>{c.fecha || 'A coordinar'}</strong> a las <strong>{c.hora || '10:00'} hs</strong>
                    </div>
                    <div className="small text-secondary">
                      Interesado: <strong>{c.clienteNombre}</strong>
                      {c.clienteTelefono && <span className="ms-2">• Tel: {c.clienteTelefono}</span>}
                      {c.clienteEmail && <span className="ms-2">• {c.clienteEmail}</span>}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {c.estado === 'pendiente' && (
                    <>
                      <button
                        className="btn btn-sm btn-success rounded-pill px-3 fw-medium shadow-sm"
                        onClick={() => cambiarEstado(c.id, 'confirmada', '¡Visita confirmada!')}
                      >
                        Aprobar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-medium"
                        onClick={() => cambiarEstado(c.id, 'cancelada', 'Visita rechazada')}
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {c.estado === 'confirmada' && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium"
                        onClick={() => cambiarEstado(c.id, 'completada', 'Visita completada')}
                      >
                        Realizada
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() => cambiarEstado(c.id, 'cancelada', 'Visita cancelada')}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {(c.estado === 'completada' || c.estado === 'cancelada') && (
                    <button
                      className="btn btn-sm btn-light border rounded-pill px-3 text-secondary"
                      onClick={() => cambiarEstado(c.id, 'pendiente', 'Visita reabierta')}
                    >
                      Reabrir
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
              ? 'Aún no tenés solicitudes de visita en tu agenda.'
              : `No se encontraron visitas con estado "${filtro}".`
          }
        />
      )}
    </div>
  )
}
