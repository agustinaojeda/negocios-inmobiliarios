import { obtenerSesion, obtenerTodosLosUsuarios } from '../../auth/services/authService'
import { obtenerPropiedades } from '../../inmuebles'
import { obtenerTodasLasPropiedades } from '../../agente/services/agenteService'

const URL_BASE = '/data'

export async function obtenerCitas() {
  const respuesta = await fetch(`${URL_BASE}/citas.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las citas')
  }
  return respuesta.json()
}

export async function obtenerMisPropiedadesDetalladas() {
  const misPropiedades = await obtenerTodasLasPropiedades();

  return misPropiedades.map((p) => {
    let dias = p.diasPublicada;
    if (!dias && p.fecha_creacion) {
      const diff = new Date() - new Date(p.fecha_creacion);
      dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    return {
      ...p,
      diasPublicada: dias || 0,
      agenteNombre: p.nombre_agente ? p.nombre_agente : 'Sin asesor asignado',
      agenteEmail: p.email_agente || null,
      agenteTelefono: p.telefono_agente || null, 
    };
  });
}

export async function obtenerMisCitasDetalladas(propietarioId = null) {
  let idBuscado = propietarioId || obtenerSesion()?.id
  if (!idBuscado) return []

  const [citas, propiedades, usuarios] = await Promise.all([
    obtenerCitas(),
    obtenerPropiedades(),
    obtenerTodosLosUsuarios()
  ])

  const misCitas = citas.filter((c) => c.propietarioId === idBuscado)

  return misCitas.map((cita) => {
    const propiedad = propiedades.find((p) => p.id === cita.propiedadId)
    const cliente = usuarios.find((u) => u.id === cita.clienteId)
    const agente = usuarios.find((u) => u.id === cita.agenteId)

    return {
      ...cita,
      propiedad, 
      clienteNombre: cliente ? cliente.nombre : 'Cliente no especificado',
      clienteTelefono: cliente?.telefono || '',
      clienteEmail: cliente?.email || '',
      agenteNombre: agente ? agente.nombre : 'Sin asesor asignado',
      agenteTelefono: agente?.telefono || ''
    }
  })
}

export async function obtenerMetricasPropietario(propietarioId = null, diasLimite = 60) {
  let idBuscado = propietarioId || obtenerSesion()?.id
  if (!idBuscado) return null

  const [propiedades, citas, usuarios] = await Promise.all([
    obtenerPropiedades(),
    obtenerCitas(),
    obtenerTodosLosUsuarios()
  ])

  const misPropiedades = propiedades.filter((p) => p.propietarioId === idBuscado)
  const misCitas = citas.filter((c) => c.propietarioId === idBuscado)

  const propiedadesEnriquecidas = misPropiedades.map((p) => {
    const agente = usuarios.find((u) => u.id === p.agenteId)

    let dias = p.diasPublicada
    if (!dias && p.fechaPublicacion) {
      const diff = new Date() - new Date(p.fechaPublicacion)
      dias = Math.floor(diff / (1000 * 60 * 60 * 24))
    }

    return {
      ...p,
      diasPublicada: dias || 0,
      agenteNombre: agente ? agente.nombre : 'Sin asesor asignado'
    }
  })

  const estancadas = propiedadesEnriquecidas.filter(
    (p) => p.estado === 'disponible' && p.diasPublicada >= diasLimite
  )

  return {
    totales: misPropiedades.length,
    disponibles: misPropiedades.filter((p) => p.estado === 'disponible').length,
    concretadas: misPropiedades.filter((p) =>
      ['alquilado', 'vendido', 'reservado'].includes(p.estado)
    ).length,
    totalCitas: misCitas.length,
    estancadas
  }
}