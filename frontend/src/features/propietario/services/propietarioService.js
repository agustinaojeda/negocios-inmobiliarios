import { obtenerSesion } from '../../auth/services/authService'
import { obtenerPropiedadesDisponibles } from '../../inmuebles/services/inmueblesService'
import { listarOperaciones } from '../../../shared/services/operacionesService'
import { apiClient } from '../../../shared/services/apiClient'

// Obtiene las citas del propietario desde la API
export async function obtenerCitas() {
  try {
    const datos = await apiClient.get('/citas')
    return datos.citas || []
  } catch (err) {
    return []
  }
}

// Obtiene los inmuebles del propietario con cálculo de días publicados
export async function obtenerMisPropiedadesDetalladas() {
  const sesion = obtenerSesion()
  const idPropietario = sesion?.id

  // Obtenemos las propiedades activas de la bd
  const todas = await obtenerPropiedadesDisponibles()

  // Filtramos las que pertenecen a este propietario por id
  const misPropiedades = todas.filter(
    (p) => Number(p.propietario_id || p.propietarioId) === Number(idPropietario)
  )

  return misPropiedades.map((p) => {
    let dias = p.diasPublicada
    const fecha = p.fecha_creacion || p.fechaPublicacion
    if (!dias && fecha) {
      const diff = new Date() - new Date(fecha)
      dias = Math.floor(diff / (1000 * 60 * 60 * 24))
    }

    return {
      ...p,
      diasPublicada: dias || 0,
      agenteNombre: p.agente_nombre
        ? `${p.agente_nombre} ${p.agente_apellido || ''}`.trim()
        : 'Sin asesor asignado',
      agenteEmail: p.email_agente || null,
      agenteTelefono: p.telefono_agente || null,
    }
  })
}

export async function obtenerMisCitasDetalladas(propietarioId = null) {
  const idBuscado = propietarioId || obtenerSesion()?.id
  if (!idBuscado) return []

  const citas = await obtenerCitas()

  // Citas sobre los inmuebles de este propietario
  const misCitas = citas.filter(
    (c) => !c.propietario_id || Number(c.propietario_id) === Number(idBuscado)
  )

  return misCitas.map((cita) => ({
    ...cita,
    fecha: cita.fecha ? String(cita.fecha).split('T')[0] : '',
    hora: cita.hora ? String(cita.hora).slice(0, 5) : '',
    propiedad: {
      id: cita.propiedad_id,
      titulo: cita.propiedad_titulo || 'Inmueble no especificado',
      direccion: cita.propiedad_direccion || '',
      zona: cita.propiedad_zona || '',
      categoria: cita.propiedad_categoria || '',
      precio:
        cita.propiedad_precio !== null ? Number(cita.propiedad_precio) : null,
      moneda: cita.propiedad_moneda || '',
      img: cita.propiedad_img || '/img/propiedades/prop1.jpg',
    },
    clienteNombre:
      `${cita.cliente_nombre || ''} ${cita.cliente_apellido || ''}`.trim() ||
      'Cliente interesado',
    clienteTelefono: cita.cliente_telefono || '',
    clienteEmail: cita.cliente_email || '',
    agenteNombre:
      `${cita.agente_nombre || ''} ${cita.agente_apellido || ''}`.trim() ||
      'Sin asesor asignado',
    agenteTelefono: cita.agente_telefono || '',
  }))
}

// Cálculo de Métricas y KPIs para el Propietario
export async function obtenerMetricasPropietario(propietarioId = null, diasLimite = 60) {
  const idBuscado = propietarioId || obtenerSesion()?.id
  if (!idBuscado) return null

  const [propiedades, citas, operaciones] = await Promise.all([
    apiClient.get('/inmuebles/panel'),
    obtenerCitas(),
    listarOperaciones(),
  ])

  // Filtramos por propietario_id de la base de datos
  const misPropiedades = (propiedades || []).filter(
    (p) => Number(p.propietario_id || p.propietarioId) === Number(idBuscado)
  )

  // En el backend /api/citas ya viene filtrado por el propietario autenticado
  const misCitas = (citas || []).filter(
    (c) => !c.propietario_id || Number(c.propietario_id || c.propietarioId) === Number(idBuscado)
  )

  const propiedadesEnriquecidas = misPropiedades.map((p) => {
    let dias = p.diasPublicada
    const fecha = p.fecha_creacion || p.fechaPublicacion
    if (!dias && fecha) {
      const diff = new Date() - new Date(fecha)
      dias = Math.floor(diff / (1000 * 60 * 60 * 24))
    }

    return {
      ...p,
      diasPublicada: dias || 0,
      agenteNombre: p.agente_nombre
        ? `${p.agente_nombre} ${p.agente_apellido || ''}`.trim()
        : 'Sin asesor asignado',
    }
  })

  // Propiedades con más de 60 días sin actividad comercial
  const estancadas = propiedadesEnriquecidas.filter(
    (p) => (p.estado_visibilidad === 'activo' || p.estado === 'disponible') && p.diasPublicada >= diasLimite
  )

  const disponiblesCount = misPropiedades.filter(
    (p) => p.estado_visibilidad === 'activo' || p.estado === 'disponible'
  ).length

  const concretadasCount = (operaciones || []).length

  return {
    totales: misPropiedades.length,
    disponibles: disponiblesCount,
    concretadas: concretadasCount,
    totalCitas: misCitas.length,
    estancadas,
  }
}
