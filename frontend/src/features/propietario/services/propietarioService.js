import { obtenerSesion, obtenerTodosLosUsuarios } from '../../auth/services/authService'
import { obtenerPropiedadesDisponibles } from '../../inmuebles/services/inmueblesService'
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

// Detalle de las citas recibidas en las propiedades del dueño
export async function obtenerMisCitasDetalladas(propietarioId = null) {
  const idBuscado = propietarioId || obtenerSesion()?.id
  if (!idBuscado) return []

  const [citas, propiedades, usuarios] = await Promise.all([
    obtenerCitas(),
    obtenerPropiedadesDisponibles(),
    obtenerTodosLosUsuarios(),
  ])

  // Citas sobre los inmuebles de este propietario
  const misCitas = citas.filter(
    (c) => !c.propietario_id || Number(c.propietario_id || c.propietarioId) === Number(idBuscado)
  )

  return misCitas.map((cita) => {
    const propiedadId = cita.propiedad_id || cita.propiedadId
    const clienteId = cita.inquilino_id || cita.clienteId
    const agenteId = cita.agente_id || cita.agenteId

    const propiedad = propiedades.find((p) => p.id === propiedadId)
    const cliente = usuarios.find((u) => u.id === clienteId)
    const agente = usuarios.find((u) => u.id === agenteId)

    return {
      ...cita,
      propiedad,
      clienteNombre:
        cita.cliente_nombre ||
        (cliente ? `${cliente.nombre} ${cliente.apellido || ''}`.trim() : 'Cliente interesado'),
      clienteTelefono: cita.cliente_telefono || cliente?.telefono || '',
      clienteEmail: cita.cliente_email || cliente?.email || '',
      agenteNombre:
        cita.agente_nombre ||
        (agente ? `${agente.nombre} ${agente.apellido || ''}`.trim() : 'Sin asesor asignado'),
      agenteTelefono: cita.agente_telefono || agente?.telefono || '',
    }
  })
}

// Cálculo de Métricas y KPIs para el Propietario
export async function obtenerMetricasPropietario(propietarioId = null, diasLimite = 60) {
  const idBuscado = propietarioId || obtenerSesion()?.id
  if (!idBuscado) return null

  const [propiedades, citas] = await Promise.all([
    obtenerPropiedadesDisponibles(),
    obtenerCitas(),
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

  const concretadasCount = misPropiedades.filter(
    (p) => p.estado_visibilidad === 'inactivo' || ['alquilado', 'vendido', 'reservado'].includes(p.estado)
  ).length

  return {
    totales: misPropiedades.length,
    disponibles: disponiblesCount,
    concretadas: concretadasCount,
    totalCitas: misCitas.length,
    estancadas,
  }
}
