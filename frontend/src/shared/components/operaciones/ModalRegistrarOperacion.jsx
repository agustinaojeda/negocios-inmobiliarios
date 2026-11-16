import { useEffect, useState } from 'react'
import Spinner from '../Spinner'
import MensajeVacio from '../MensajeVacio'
import FormInput from '../panel/FormInput'
import { crearOperacion } from '../../services/operacionesService'
import { listarUsuarios } from '../../services/usuariosService'
import { obtenerTodasLasPropiedades } from '../../../features/agente/services/agenteService'
import { obtenerSesion } from '../../../features/auth/services/authService'
import { formatearPrecio } from '../../utils/formato'

const BADGES_TIPO = {
  venta: 'bg-success-subtle text-success border border-success-subtle',
  alquiler: 'bg-primary-subtle text-primary border border-primary-subtle',
}

function mensajeDeErrorCarga(error) {
  if (error?.status === 403) return 'No tenés permisos para cargar inmuebles y clientes.'
  if (error?.status === 0) return 'No se pudo conectar con el servidor.'
  return error?.message || 'No se pudieron cargar los datos del formulario.'
}

function mensajeDeErrorEnvio(error) {
  if (error?.status === 400) return error.message || 'Los datos de la operación no son válidos.'
  if (error?.status === 403) return 'No tenés permisos para registrar esta operación.'
  if (error?.status === 404) return 'El inmueble ya no existe.'
  if (error?.status === 409) return 'El inmueble ya no está disponible o ya fue concretado.'
  if (error?.status === 0) return 'No se pudo conectar con el servidor.'
  return error?.message || 'No se pudo registrar la operación.'
}

function filtrarInmuebles(inmuebles, sesion) {
  const esAgente = sesion?.rol === 'agente'
  const idAgente = Number(sesion?.id)

  return (inmuebles || []).filter((p) => {
    const visibilidad = p.estado_visibilidad || p.estado
    if (visibilidad !== 'activo') return false
    if (!esAgente) return true
    return Number(p.agente_id) === idAgente
  })
}

function filtrarClientes(usuarios) {
  return (usuarios || []).filter(
    (u) => u.rol === 'inquilino' && u.estaActivo !== false
  )
}

function ModalRegistrarOperacionContenido({ onCerrar, onCreada, propiedadInicial }) {
  const sesion = obtenerSesion()

  const [intento, setIntento] = useState(0)
  const [carga, setCarga] = useState({
    clave: null,
    inmuebles: [],
    clientes: [],
    error: null,
  })

  const [propiedadId, setPropiedadId] = useState(
    propiedadInicial?.id ? String(propiedadInicial.id) : ''
  )
  const [clienteId, setClienteId] = useState('')
  const [moneda, setMoneda] = useState(
    String(propiedadInicial?.moneda || 'USD').toUpperCase()
  )
  const [montoCierre, setMontoCierre] = useState(
    propiedadInicial?.precio !== undefined && propiedadInicial?.precio !== null
      ? String(propiedadInicial.precio)
      : ''
  )
  const [fechaInicioContrato, setFechaInicioContrato] = useState('')
  const [fechaFinContrato, setFechaFinContrato] = useState('')

  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')

  const clave = `carga-${intento}`

  useEffect(() => {
    let ignorar = false

    Promise.all([obtenerTodasLasPropiedades(), listarUsuarios()])
      .then(([inmuebles, usuarios]) => {
        if (!ignorar) {
          setCarga({
            clave: `carga-${intento}`,
            inmuebles: inmuebles || [],
            clientes: usuarios || [],
            error: null,
          })
        }
      })
      .catch((err) => {
        if (!ignorar) {
          setCarga({
            clave: `carga-${intento}`,
            inmuebles: [],
            clientes: [],
            error: mensajeDeErrorCarga(err),
          })
        }
      })

    return () => {
      ignorar = true
    }
  }, [intento])

  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape' && !enviando) onCerrar()
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [onCerrar, enviando])

  const cargando = carga.clave !== clave
  const inmueblesActivos = cargando ? [] : filtrarInmuebles(carga.inmuebles, sesion)
  const clientesActivos = cargando ? [] : filtrarClientes(carga.clientes)
  const errorCarga = cargando ? null : carga.error

  const propiedadSeleccionada =
    inmueblesActivos.find((p) => String(p.id) === String(propiedadId)) ||
    (propiedadInicial && String(propiedadInicial.id) === String(propiedadId)
      ? propiedadInicial
      : null)

  const tipo = String(propiedadSeleccionada?.estado_comercial || 'venta').toLowerCase()
  const esAlquiler = tipo === 'alquiler'
  const sinOpciones = inmueblesActivos.length === 0 || clientesActivos.length === 0

  const manejarBackdrop = (evento) => {
    if (evento.target === evento.currentTarget && !enviando) onCerrar()
  }

  const seleccionarPropiedad = (evento) => {
    const id = evento.target.value
    setPropiedadId(id)
    setErrorEnvio('')

    const propiedad = inmueblesActivos.find((p) => String(p.id) === String(id))
    if (!propiedad) return

    setMoneda(String(propiedad.moneda || 'USD').toUpperCase())
    setMontoCierre(
      propiedad.precio !== undefined && propiedad.precio !== null
        ? String(propiedad.precio)
        : ''
    )

    if (String(propiedad.estado_comercial || 'venta').toLowerCase() !== 'alquiler') {
      setFechaInicioContrato('')
      setFechaFinContrato('')
    }
  }

  const manejarSubmit = async (evento) => {
    evento.preventDefault()
    setErrorEnvio('')

    const monto = Number(montoCierre)

    if (!propiedadId) {
      setErrorEnvio('Seleccioná un inmueble.')
      return
    }

    if (!clienteId) {
      setErrorEnvio('Seleccioná un cliente.')
      return
    }

    if (!montoCierre || Number.isNaN(monto) || monto <= 0) {
      setErrorEnvio('El monto de cierre debe ser un número mayor a cero.')
      return
    }

    if (esAlquiler) {
      if (!fechaInicioContrato || !fechaFinContrato) {
        setErrorEnvio('Para un alquiler tenés que indicar el inicio y el fin del contrato.')
        return
      }

      if (fechaFinContrato < fechaInicioContrato) {
        setErrorEnvio('La fecha de fin no puede ser anterior a la fecha de inicio.')
        return
      }
    }

    setEnviando(true)

    try {
      const resultado = await crearOperacion({
        propiedadId,
        clienteId,
        moneda,
        montoCierre: monto,
        fechaInicioContrato: esAlquiler ? fechaInicioContrato : '',
        fechaFinContrato: esAlquiler ? fechaFinContrato : '',
      })
      onCreada(resultado)
    } catch (err) {
      setErrorEnvio(mensajeDeErrorEnvio(err))
      setEnviando(false)
    }
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
              <h5 className="modal-title fw-bold mb-0">Registrar operación</h5>
              <small className="opacity-75">
                Cerrá una venta o un contrato de alquiler sobre un inmueble activo.
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onCerrar}
              disabled={enviando}
            ></button>
          </div>

          <div className="modal-body px-4 py-3">
            {cargando ? (
              <Spinner texto="Cargando inmuebles y clientes..." />
            ) : errorCarga ? (
              <MensajeVacio titulo="No pudimos cargar el formulario" texto={errorCarga}>
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
            ) : inmueblesActivos.length === 0 ? (
              <MensajeVacio
                titulo="Sin inmuebles disponibles"
                texto="No hay inmuebles activos sobre los que puedas registrar una operación."
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-4"
                  onClick={onCerrar}
                >
                  Cerrar
                </button>
              </MensajeVacio>
            ) : clientesActivos.length === 0 ? (
              <MensajeVacio
                titulo="Sin clientes disponibles"
                texto="No hay inquilinos activos para asignar a la operación."
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-4"
                  onClick={onCerrar}
                >
                  Cerrar
                </button>
              </MensajeVacio>
            ) : (
              <form id="form-registrar-operacion" onSubmit={manejarSubmit}>
                {errorEnvio && (
                  <div className="alert alert-danger rounded-3 small py-2 mb-3" role="alert">
                    {errorEnvio}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="operacion-propiedad" className="form-label small fw-medium text-secondary">
                      Inmueble
                    </label>
                    <select
                      id="operacion-propiedad"
                      className="form-select rounded-3 py-2"
                      value={propiedadId}
                      onChange={seleccionarPropiedad}
                      disabled={enviando}
                      required
                    >
                      <option value="">Seleccioná un inmueble</option>
                      {inmueblesActivos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.titulo}
                          {p.zona ? ` — ${p.zona}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {propiedadSeleccionada && (
                    <div className="col-12">
                      <div className="rounded-3 px-3 py-2" style={{ backgroundColor: '#f1f4f9' }}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div>
                            <div className="small text-muted mb-1">Tipo de operación</div>
                            <span className={`badge rounded-pill text-uppercase ${BADGES_TIPO[tipo] || 'bg-secondary text-white'}`}>
                              {tipo}
                            </span>
                          </div>
                          <div className="text-end">
                            <div className="small text-muted mb-1">Precio publicado</div>
                            <div className="fw-semibold text-dark">
                              {formatearPrecio(
                                Number(propiedadSeleccionada.precio || 0),
                                String(propiedadSeleccionada.moneda || moneda).toUpperCase()
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <label htmlFor="operacion-cliente" className="form-label small fw-medium text-secondary">
                      Cliente
                    </label>
                    <select
                      id="operacion-cliente"
                      className="form-select rounded-3 py-2"
                      value={clienteId}
                      onChange={(evento) => {
                        setClienteId(evento.target.value)
                        setErrorEnvio('')
                      }}
                      disabled={enviando}
                      required
                    >
                      <option value="">Seleccioná un cliente</option>
                      {clientesActivos.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {[cliente.nombre, cliente.apellido].filter(Boolean).join(' ')}
                          {cliente.email ? ` — ${cliente.email}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="operacion-moneda" className="form-label small fw-medium text-secondary">
                      Moneda
                    </label>
                    <select
                      id="operacion-moneda"
                      className="form-select rounded-3 py-2"
                      value={moneda}
                      onChange={(evento) => {
                        setMoneda(evento.target.value)
                        setErrorEnvio('')
                      }}
                      disabled={enviando}
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                  </div>

                  <FormInput
                    id="operacion-monto"
                    name="montoCierre"
                    type="number"
                    label="Monto de cierre"
                    value={montoCierre}
                    onChange={(evento) => {
                      setMontoCierre(evento.target.value)
                      setErrorEnvio('')
                    }}
                    placeholder="0"
                    required
                    disabled={enviando}
                    className="col-md-6"
                  />

                  {esAlquiler && (
                    <>
                      <FormInput
                        id="operacion-fecha-inicio"
                        name="fechaInicioContrato"
                        type="date"
                        label="Inicio del contrato"
                        value={fechaInicioContrato}
                        onChange={(evento) => {
                          setFechaInicioContrato(evento.target.value)
                          setErrorEnvio('')
                        }}
                        required
                        disabled={enviando}
                        className="col-md-6"
                      />
                      <FormInput
                        id="operacion-fecha-fin"
                        name="fechaFinContrato"
                        type="date"
                        label="Fin del contrato"
                        value={fechaFinContrato}
                        onChange={(evento) => {
                          setFechaFinContrato(evento.target.value)
                          setErrorEnvio('')
                        }}
                        required
                        disabled={enviando}
                        className="col-md-6"
                      />
                    </>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onCerrar}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-registrar-operacion"
              className="btn btn-primary rounded-pill px-4"
              style={{ backgroundColor: '#13284c', borderColor: '#13284c' }}
              disabled={enviando || cargando || Boolean(errorCarga) || sinOpciones}
            >
              {enviando ? 'Registrando...' : 'Registrar operación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ModalRegistrarOperacion({
  mostrar,
  onCerrar,
  onCreada,
  propiedadInicial,
}) {
  if (!mostrar) return null

  return (
    <ModalRegistrarOperacionContenido
      onCerrar={onCerrar}
      onCreada={onCreada}
      propiedadInicial={propiedadInicial}
    />
  )
}
