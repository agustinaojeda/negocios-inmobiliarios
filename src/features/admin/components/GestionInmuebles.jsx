import { useState } from 'react'
import { useFetch } from '../../../shared/hooks/useFetch'
import { obtenerPropiedades } from '../../inmuebles'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import TablaGestionInmuebles from '../../../shared/components/propiedades/TablaGestionInmuebles'

export default function GestionInmuebles() {
  const { datos: propiedades = [], cargando, error } = useFetch(obtenerPropiedades)
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const listaPropiedades = propiedades || []
  const propiedadesFiltradas =
    filtroEstado === 'todos'
      ? listaPropiedades
      : listaPropiedades.filter((p) => p.estado === filtroEstado)

  if (cargando) return <Spinner texto="Cargando catálogo..." />
  if (error) return <MensajeVacio titulo="No pudimos cargar el catálogo" texto={error.message} />

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1" style={{ color: '#13284c' }}>
            Supervisión y Catálogo de Inmuebles
          </h2>
          <p className="text-muted small mb-0">
            Control de publicaciones, estados y asignaciones.
          </p>
        </div>
        <button className="btn btn-sm btn-primary rounded-pill px-3">
          + Publicar Inmueble
        </button>
      </div>

      {/* Filtros rápidos por estado */}
      <div className="btn-group btn-group-sm mb-3">
        {['todos', 'disponible', 'reservado', 'vendido'].map((estado) => (
          <button
            key={estado}
            className={`btn ${filtroEstado === estado ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFiltroEstado(estado)}
          >
            {estado.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tabla Compartida de Gestión */}
      {propiedadesFiltradas.length > 0 ? (
        <TablaGestionInmuebles
          propiedades={propiedadesFiltradas}
          editableEstado={false}
          onEditar={(p) => console.log('Editar inmueble admin', p)}
          onEliminar={(id, titulo) => console.log('Pausar inmueble admin', id, titulo)}
          textoBotonEliminar="Pausar"
        />
      ) : (
        <MensajeVacio
          titulo="No se encontraron inmuebles"
          texto="No hay propiedades con el estado seleccionado en el catálogo."
        />
      )}
    </div>
  )
}
