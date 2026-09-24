import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Toast from '../../../shared/components/Toast'
import TablaGestionInmuebles from '../../../shared/components/propiedades/TablaGestionInmuebles'
import ModalFormularioInmuebles from './ModalFormularioInmuebles'
import { useCarteraInmuebles } from '../hooks/useCarteraInmuebles'

const ESTADOS_FILTRO = ['todos', 'disponible', 'reservado', 'alquilado', 'vendido']

export default function CarteraInmuebles({ agenteId }) {
  const {
    propiedadesFiltradas,
    cargando,
    error,
    filtroEstado,
    setFiltroEstado,
    notificacion,
    modalAbierto,
    propiedadAEditar,
    cambiarEstado,
    guardarPropiedad,
    eliminarPropiedad,
    abrirCrear,
    abrirEditar,
    cerrarModal,
  } = useCarteraInmuebles(agenteId)

  if (cargando) return <Spinner texto="Cargando cartera..." />
  if (error) return <MensajeVacio titulo="Error al cargar cartera" texto={error.message || error} />

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-relative">
      <Toast mensaje={notificacion} />

      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
            Cartera de Propiedades Asignadas
          </h2>
          <p className="text-muted small mb-0">
            Control de captaciones, estados y publicaciones comerciales.
          </p>
        </div>
        <button
          className="btn btn-sm btn-primary rounded-pill px-3 fw-medium"
          style={{ backgroundColor: '#13284c', borderColor: '#13284c' }}
          onClick={abrirCrear}
        >
          + Captar Inmueble
        </button>
      </div>

      {/* Filtros rápidos */}
      <div className="btn-group btn-group-sm mb-3">
        {ESTADOS_FILTRO.map((estado) => (
          <button
            key={estado}
            className={`btn ${filtroEstado === estado ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado(estado)}
          >
            {estado.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tabla de Gestión Reutilizable */}
      {propiedadesFiltradas.length > 0 ? (
        <TablaGestionInmuebles
          propiedades={propiedadesFiltradas}
          editableEstado={true}
          onCambiarEstado={cambiarEstado}
          onEditar={abrirEditar}
          onEliminar={eliminarPropiedad}
          textoBotonEliminar="Baja"
        />
      ) : (
        <MensajeVacio
          titulo="No se encontraron inmuebles"
          texto="No hay propiedades con el estado seleccionado en tu cartera."
        />
      )}

      {/* Modal ABM */}
      <ModalFormularioInmuebles
        mostrar={modalAbierto}
        onCerrar={cerrarModal}
        onGuardar={guardarPropiedad}
        propiedadEditar={propiedadAEditar}
      />
    </div>
  )
}