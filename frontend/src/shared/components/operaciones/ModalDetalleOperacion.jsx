import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Spinner from '../Spinner'
import MensajeVacio from '../MensajeVacio'
import { obtenerOperacionDetalle } from '../../services/operacionesService'
import { resolverUrlImagen } from '../../config/api'
import { formatearPrecio } from '../../utils/formato'

const BADGES_TIPO = {
  venta: 'bg-success-subtle text-success border border-success-subtle',
  alquiler: 'bg-primary-subtle text-primary border border-primary-subtle',
}

function formatearFecha(fecha) {
  if (!fecha) return '—'

  const soloFecha = String(fecha).split('T')[0]
  const [anio, mes, dia] = soloFecha.split('-')
  if (!anio || !mes || !dia) return soloFecha

  return `${dia}/${mes}/${anio}`
}

function nombreCompleto(nombre, apellido) {
  return [nombre, apellido].filter(Boolean).join(' ')
}

function mensajeDeError(error) {
  if (error?.status === 403) return 'No tenés permisos para ver esta operación.'
  if (error?.status === 404) return 'La operación ya no existe.'
  if (error?.status === 0) return 'No se pudo conectar con el servidor.'
  return error?.message || 'No se pudo cargar el detalle de la operación.'
}

function ModalDetalleOperacionContenido({ operacionId, onCerrar }) {
  const [intento, setIntento] = useState(0)
  const [respuesta, setRespuesta] = useState({
    clave: null,
    operacion: null,
    error: null,
  })

  const clave = `${operacionId}-${intento}`

  useEffect(() => {
    let ignorar = false

    obtenerOperacionDetalle(operacionId)
      .then((datos) => {
        if (!ignorar) {
          setRespuesta({ clave: `${operacionId}-${intento}`, operacion: datos, error: null })
        }
      })
      .catch((err) => {
        if (!ignorar) {
          setRespuesta({
            clave: `${operacionId}-${intento}`,
            operacion: null,
            error: mensajeDeError(err),
          })
        }
      })

    return () => {
      ignorar = true
    }
  }, [operacionId, intento])

  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [onCerrar])

  const cargando = respuesta.clave !== clave
  const operacion = cargando ? null : respuesta.operacion
  const error = cargando ? null : respuesta.error

  const manejarBackdrop = (evento) => {
    if (evento.target === evento.currentTarget) onCerrar()
  }

  const tipo = operacion?.tipo_operacion
    ? operacion.tipo_operacion.toLowerCase()
    : 'venta'
  const nombreCliente = nombreCompleto(
    operacion?.cliente_nombre,
    operacion?.cliente_apellido
  )
  const nombreAgente = nombreCompleto(
    operacion?.agente_nombre,
    operacion?.agente_apellido
  )
  const nombrePropietario = nombreCompleto(
    operacion?.propietario_nombre,
    operacion?.propietario_apellido
  )
  const moneda = String(operacion?.moneda || 'USD').toUpperCase()

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
              <h5 className="modal-title fw-bold mb-0">Detalle de la operación</h5>
              <small className="opacity-75">
                {operacion?.propiedad_titulo || 'Operación comercial'}
              </small>
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
              <Spinner texto="Cargando detalle de la operación..." />
            ) : error ? (
              <MensajeVacio titulo="No pudimos cargar la operación" texto={error}>
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
            ) : operacion ? (
              <div className="row g-4">
                <div className="col-12 col-md-5">
                  <img
                    src={resolverUrlImagen(operacion.propiedad_img) || '/img/propiedades/prop1.jpg'}
                    alt={operacion.propiedad_titulo || 'Inmueble'}
                    className="img-fluid rounded-3 border shadow-sm w-100 object-fit-cover"
                    style={{ maxHeight: '220px' }}
                    onError={(evento) => {
                      evento.target.src = '/img/propiedades/prop1.jpg'
                    }}
                  />
                  <Link
                    to={`/inmueble/${operacion.propiedad_id}`}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 mt-3 w-100"
                  >
                    Ver inmueble
                  </Link>
                </div>

                <div className="col-12 col-md-7">
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <h3 className="h6 fw-bold mb-0" style={{ color: '#13284c' }}>
                      {operacion.propiedad_titulo || `Inmueble #${operacion.propiedad_id}`}
                    </h3>
                    <span
                      className={`badge rounded-pill px-2 py-1 small text-uppercase ${
                        BADGES_TIPO[tipo] || 'bg-secondary text-white'
                      }`}
                    >
                      {tipo}
                    </span>
                  </div>

                  <p className="text-muted small mb-3">
                    {[operacion.propiedad_direccion, operacion.propiedad_zona]
                      .filter(Boolean)
                      .join(' • ') || 'Ubicación no especificada'}
                  </p>

                  <div className="rounded-3 px-3 py-2 mb-3" style={{ backgroundColor: '#f1f4f9' }}>
                    <div className="small text-muted mb-1">Monto de cierre</div>
                    <div className="h5 fw-bold mb-0" style={{ color: '#13284c' }}>
                      {formatearPrecio(Number(operacion.monto_cierre || 0), moneda)}
                    </div>
                    <div className="small text-secondary mt-1">
                      Operación del {formatearFecha(operacion.fecha_operacion)}
                    </div>
                  </div>

                  {(operacion.fecha_inicio_contrato || operacion.fecha_fin_contrato) && (
                    <div className="mb-3">
                      <div className="small text-muted mb-1">Vigencia del contrato</div>
                      <div className="small text-dark">
                        {operacion.fecha_inicio_contrato
                          ? formatearFecha(operacion.fecha_inicio_contrato)
                          : '—'}
                        {' al '}
                        {operacion.fecha_fin_contrato
                          ? formatearFecha(operacion.fecha_fin_contrato)
                          : '—'}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Cliente</div>
                    <div className="fw-semibold text-dark">
                      {nombreCliente || 'Cliente sin identificar'}
                    </div>
                    {operacion.cliente_email && (
                      <div className="small text-secondary">{operacion.cliente_email}</div>
                    )}
                    {operacion.cliente_telefono && (
                      <div className="small text-secondary">Tel: {operacion.cliente_telefono}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="small text-muted mb-1">Agente</div>
                    <div className="fw-semibold text-dark">
                      {nombreAgente || 'Sin agente asignado'}
                    </div>
                  </div>

                  <div className="mb-0">
                    <div className="small text-muted mb-1">Propietario</div>
                    <div className="fw-semibold text-dark">
                      {nombrePropietario || 'Sin propietario asignado'}
                    </div>
                  </div>
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

export default function ModalDetalleOperacion({ mostrar, onCerrar, operacionId }) {
  if (!mostrar || operacionId === null || operacionId === undefined) return null

  return <ModalDetalleOperacionContenido operacionId={operacionId} onCerrar={onCerrar} />
}
