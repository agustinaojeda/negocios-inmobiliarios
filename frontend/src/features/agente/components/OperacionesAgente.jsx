import { useState } from 'react'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Toast from '../../../shared/components/Toast'
import TablaOperaciones from '../../../shared/components/operaciones/TablaOperaciones'
import ModalDetalleOperacion from '../../../shared/components/operaciones/ModalDetalleOperacion'
import ModalRegistrarOperacion from '../../../shared/components/operaciones/ModalRegistrarOperacion'
import { useFetch } from '../../../shared/hooks/useFetch'
import { useToast } from '../../../shared/hooks/useToast'
import { listarOperaciones } from '../../../shared/services/operacionesService'

export default function OperacionesAgente() {
  const [version, setVersion] = useState(0)
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const { datos: operacionesCargadas, cargando, error } = useFetch(listarOperaciones, version)
  const operaciones = operacionesCargadas || []
  const { mensaje: notificacion, mostrarToast } = useToast()

  const manejarCreada = () => {
    setModalAbierto(false)
    setVersion((valor) => valor + 1)
    mostrarToast('Operación registrada correctamente')
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
      <Toast mensaje={notificacion} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
            Mis Operaciones
          </h2>
          <p className="text-muted small mb-0">
            Operaciones de venta y contratos de alquiler cerrados sobre tus inmuebles asignados.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
            Total: {operaciones.length}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-primary rounded-pill px-3"
            style={{ backgroundColor: '#13284c', borderColor: '#13284c' }}
            onClick={() => setModalAbierto(true)}
          >
            Registrar operación
          </button>
        </div>
      </div>

      {cargando ? (
        <Spinner texto="Cargando operaciones..." />
      ) : error ? (
        <MensajeVacio titulo="Error al cargar operaciones" texto={error.message} />
      ) : operaciones.length === 0 ? (
        <MensajeVacio
          titulo="Sin operaciones"
          texto="Todavía no tenés operaciones registradas en tus inmuebles asignados."
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

      <ModalRegistrarOperacion
        mostrar={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onCreada={manejarCreada}
      />
    </div>
  )
}
