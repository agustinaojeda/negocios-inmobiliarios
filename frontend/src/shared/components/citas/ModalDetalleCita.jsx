import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Spinner from '../Spinner'
import MensajeVacio from '../MensajeVacio'
import { IconoCalendario, IconoReloj } from '../Iconos'
import { obtenerCitaDetalle } from '../../services/citasService'
import { resolverUrlImagen } from '../../config/api'

const BADGES_ESTADO = {
  confirmada: 'bg-success text-white',
  pendiente: 'bg-warning text-dark',
  completada: 'bg-info text-dark',
  cancelada: 'bg-danger text-white',
}

function formatearFecha(fecha) {
  if (!fecha) return '—'

  const [anio, mes, dia] = String(fecha).split('-')
  if (!anio || !mes || !dia) return String(fecha)

  return `${dia}/${mes}/${anio}`
}

function mensajeDeError(error) {
  if (error?.status === 403) return 'No tenés permiso para ver esta cita.'
  if (error?.status === 404) return 'La cita ya no existe.'
  if (error?.status === 0) return 'No se pudo conectar con el servidor.'
  return error?.message || 'No se pudo cargar el detalle de la cita.'
}

function ModalDetalleCitaContenido({ citaId, onCerrar }) {
  const [intento, setIntento] = useState(0)
  const [respuesta, setRespuesta] = useState({
    clave: null,
    cita: null,
    error: null,
  })
  
  const clave = `${citaId}-${intento}`

  useEffect(() => {
    let ignorar = false

    obtenerCitaDetalle(citaId)
      .then((datos) => {
        if (!ignorar) {
          setRespuesta({ clave: `${citaId}-${intento}`, cita: datos, error: null })
        }
      })
      .catch((err) => {
        if (!ignorar) {
          setRespuesta({
            clave: `${citaId}-${intento}`,
            cita: null,
            error: mensajeDeError(err),
          })
        }
      })

    return () => {
      ignorar = true
    }
  }, [citaId, intento])

  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [onCerrar])

  const cargando = respuesta.clave !== clave
  const cita = cargando ? null : respuesta.cita
  const error = cargando ? null : respuesta.error

  const manejarBackdrop = (evento) => {
    if (evento.target === evento.currentTarget) onCerrar()
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1055 }}
      onClick={manejarBackdrop}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div className="modal-header border-0 text-white px-4 py-3" style={{ backgroundColor: '#13284c' }}>
            <div>
              <h5 className="modal-title fw-bold mb-0">Detalle de la cita</h5>
              <small className="opacity-75">{cita?.propiedad?.titulo || 'Cita de visita'}</small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onCerrar}
            ></button>
          </div>

          <div className="modal-body px-4 py-3">
            {cargando ? (
              <Spinner texto="Cargando detalle de la cita..." />
            ) : error ? (
              <MensajeVacio titulo="No pudimos cargar la cita" texto={error}>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-pill px-4"
                    style={{ backgroundColor: '#13284c', borderColor: '#13284c' }}
                    onClick={() => setIntento((valor) => valor + 1)}
                  >
                    Reintentar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-4"
                    onClick={onCerrar}
                  >
                    Cerrar
                  </button>
                </div>
              </MensajeVacio>
            ) : cita ? (
              <div className="row g-4">
                <div className="col-12 col-md-5">
                  <img
                    src={resolverUrlImagen(cita.propiedad.img)}
                    alt={cita.propiedad.titulo}
                    className="img-fluid rounded-3 border shadow-sm w-100 object-fit-cover"
                    style={{ maxHeight: '220px' }}
                    onError={(evento) => {
                      evento.target.src = '/img/propiedades/prop1.jpg'
                    }}
                  />
                  <Link
                    to={`/inmueble/${cita.propiedad.id}`}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 mt-3 w-100"
                  >
                    Ver inmueble
                  </Link>
                </div>

                <div className="col-12 col-md-7">
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <h3 className="h6 fw-bold mb-0" style={{ color: '#13284c' }}>
                      {cita.propiedad.titulo}
                    </h3>
                    <span
                      className={`badge rounded-pill px-2 py-1 small text-capitalize ${
                        BADGES_ESTADO[cita.estado?.toLowerCase()] || 'bg-secondary text-white'
                      }`}
                    >
                      {cita.estado}
                    </span>
                  </div>

                  <p className="text-muted small mb-3">
                    {[cita.propiedad.direccion, cita.propiedad.zona].filter(Boolean).join(' • ') || 'Ubicación no especificada'}
                  </p>

                  <div className="rounded-3 px-3 py-2 mb-3" style={{ backgroundColor: '#f1f4f9' }}>
                    <div className="small text-muted mb-1">Visita</div>
                    <div className="fw-semibold d-flex align-items-center flex-wrap gap-3">
                      <span className="d-inline-flex align-items-center gap-1">
                        <IconoCalendario size={14} />
                        {formatearFecha(cita.fecha)}
                      </span>
                      {cita.hora && (
                        <span className="d-inline-flex align-items-center gap-1">
                          <IconoReloj size={14} />
                          {cita.hora} hs
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Cliente</div>
                    <div className="fw-semibold text-dark">{cita.cliente.nombre}</div>
                    {cita.cliente.email && <div className="small text-secondary">{cita.cliente.email}</div>}
                    {cita.cliente.telefono && <div className="small text-secondary">Tel: {cita.cliente.telefono}</div>}
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Agente asignado</div>
                    <div className="fw-semibold text-dark">{cita.agente.nombre}</div>
                    {cita.agente.telefono && <div className="small text-secondary">Tel: {cita.agente.telefono}</div>}
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Mensaje</div>
                    <p className="small mb-0 text-secondary">
                      {cita.mensaje || 'Sin mensaje'}
                    </p>
                  </div>

                  {cita.fechaCreacion && (
                    <div className="small text-muted">
                      Cita creada el {formatearFecha(cita.fechaCreacion)}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-0">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onCerrar}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ModalDetalleCita({ mostrar, onCerrar, citaId }) {
  if (!mostrar || citaId === null || citaId === undefined) return null

  return <ModalDetalleCitaContenido citaId={citaId} onCerrar={onCerrar} />
}
