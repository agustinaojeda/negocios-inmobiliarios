import { useState } from 'react'
import Spinner from '../../../shared/components/Spinner'
import MensajeVacio from '../../../shared/components/MensajeVacio'
import Toast from '../../../shared/components/Toast'
import TablaGestionInmuebles from '../../../shared/components/propiedades/TablaGestionInmuebles'
import ModalFormularioInmuebles from './ModalFormularioInmuebles'
import ModalHistorialPrecios from '../../inmuebles/components/ModalHistorialPrecios'
import ModalConfirmar from '../../../shared/components/ModalConfirmar'
import { useCarteraInmuebles } from '../hooks/useCarteraInmuebles'
import { FiltroPills } from '../../inmuebles'
import {
  obtenerHistorialPrecios,
  mensajeErrorHistorial,
} from '../../inmuebles/services/inmueblesService'
import './filtro-compacto.css'

const ESTADOS_FILTRO = ['todas', 'activo', 'inactivo']

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
    idsConOperacion,
    confirmacionEstado,
    procesandoEstado,
    cambiarEstado,
    guardarPropiedad,
    alternarEstadoPropiedad,
    confirmarAlternarEstado,
    cancelarAlternarEstado,
    abrirCrear,
    abrirEditar,
    cerrarModal,
  } = useCarteraInmuebles(agenteId)

  const [propiedadHistorial, setPropiedadHistorial] = useState(null)
  const [datosHistorial, setDatosHistorial] = useState(null)
  const [cargandoHistorial, setCargandoHistorial] = useState(false)
  const [errorHistorial, setErrorHistorial] = useState(null)

  const abrirHistorial = async (propiedad) => {
    setPropiedadHistorial(propiedad)
    setDatosHistorial(null)
    setErrorHistorial(null)
    setCargandoHistorial(true)

    try {
      const datos = await obtenerHistorialPrecios(propiedad.id)
      setDatosHistorial(datos)
    } catch (err) {
      setErrorHistorial(mensajeErrorHistorial(err))
    } finally {
      setCargandoHistorial(false)
    }
  }

  const cerrarHistorial = () => {
    setPropiedadHistorial(null)
    setDatosHistorial(null)
    setErrorHistorial(null)
    setCargandoHistorial(false)
  }

  if (cargando) return <Spinner texto="Cargando cartera..." />
  if (error) {
    return (
      <MensajeVacio
        titulo="Error al cargar cartera"
        texto={typeof error === 'string' ? error : error?.message || 'Ocurrió un error inesperado'}
      />
    )
  }

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

      {/* Filtros rápidos con FiltroPills y estilo compacto */}
      <div className="filtro-compacto mb-3">
        <FiltroPills
          titulo="Filtrar por visibilidad:"
          opciones={ESTADOS_FILTRO}
          seleccionado={filtroEstado}
          onSeleccionar={setFiltroEstado}
        />
      </div>

      {/* Tabla de Gestión Reutilizable */}
      {propiedadesFiltradas.length > 0 ? (
        <TablaGestionInmuebles
          propiedades={propiedadesFiltradas}
          editableEstado={true}
          onEditar={abrirEditar}
          onAlternarEstado={alternarEstadoPropiedad}
          onVerHistorial={abrirHistorial}
          idsConOperacion={idsConOperacion}
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

      {/* Modal historial de precios */}
      <ModalHistorialPrecios
        mostrar={Boolean(propiedadHistorial)}
        onCerrar={cerrarHistorial}
        propiedad={propiedadHistorial}
        historial={datosHistorial?.historial}
        precioActual={datosHistorial?.precio_actual}
        cargando={cargandoHistorial}
        error={errorHistorial}
        onReintentar={() => abrirHistorial(propiedadHistorial)}
      />

      {/* Confirmación de baja / alta */}
      <ModalConfirmar
        mostrar={Boolean(confirmacionEstado)}
        titulo={
          confirmacionEstado?.estadoActual === 'activo'
            ? 'Dar de baja el inmueble'
            : 'Dar de alta el inmueble'
        }
        mensaje={
          confirmacionEstado?.estadoActual === 'activo'
            ? `El inmueble "${confirmacionEstado?.titulo || ''}" dejará de aparecer en el catálogo público. Vas a poder darlo de alta más adelante.`
            : `El inmueble "${confirmacionEstado?.titulo || ''}" volverá a mostrarse en el catálogo público.`
        }
        textoConfirmar={
          confirmacionEstado?.estadoActual === 'activo'
            ? 'Dar de baja'
            : 'Dar de alta'
        }
        variante={
          confirmacionEstado?.estadoActual === 'activo' ? 'danger' : 'success'
        }
        cargando={procesandoEstado}
        onConfirmar={confirmarAlternarEstado}
        onCerrar={cancelarAlternarEstado}
      />
    </div>
  )
}