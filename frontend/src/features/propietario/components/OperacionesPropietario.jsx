import { useState } from 'react'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import TablaOperaciones from '../../../shared/components/operaciones/TablaOperaciones'
import ModalDetalleOperacion from '../../../shared/components/operaciones/ModalDetalleOperacion'
import { useFetch } from '../../../shared/hooks/useFetch'
import { listarOperaciones } from '../../../shared/services/operacionesService'

export default function OperacionesPropietario() {
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null)
  const { datos: operacionesCargadas, cargando, error } = useFetch(listarOperaciones)
  const operaciones = operacionesCargadas || []

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
            Mis Operaciones
          </h2>
          <p className="text-muted small mb-0">
            Operaciones de venta y contratos de alquiler cerrados sobre tus inmuebles.
          </p>
        </div>

        <span className="badge rounded-pill bg-light text-dark border px-3 py-2">
          Total: {operaciones.length}
        </span>
      </div>

      {cargando ? (
        <Spinner texto="Cargando operaciones..." />
      ) : error ? (
        <MensajeVacio titulo="Error al cargar operaciones" texto={error.message} />
      ) : operaciones.length === 0 ? (
        <MensajeVacio
          titulo="Sin operaciones"
          texto="Todavía no hay operaciones registradas en tus inmuebles."
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
