import { obtenerSesion, obtenerTodosLosUsuarios } from '../../auth/services/authService'

const URL_BASE = '/data'
const CLAVE_PROPIEDADES = 'negocios-inmobiliarios:propiedades'
const CLAVE_CITAS = 'negocios-inmobiliarios:citas'

// --- UTILIDADES LOCAL STORAGE ---
function obtenerPropiedadesLocal() {
  try {
    const data = localStorage.getItem(CLAVE_PROPIEDADES)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function guardarPropiedadesLocal(propiedades) {
  localStorage.setItem(CLAVE_PROPIEDADES, JSON.stringify(propiedades))
}

function obtenerCitasLocal() {
  try {
    const data = localStorage.getItem(CLAVE_CITAS)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function guardarCitasLocal(citas) {
  localStorage.setItem(CLAVE_CITAS, JSON.stringify(citas))
}

// --- GESTIÓN DE PROPIEDADES ---

/**
 * Obtiene todas las propiedades (localStorage o json inicial)
 */
export async function obtenerTodasLasPropiedades() {
  const local = obtenerPropiedadesLocal()
  if (local && local.length > 0) {
    return local
  }

  try {
    const res = await fetch(`${URL_BASE}/propiedades.json`)
    if (res.ok) {
      const propiedadesBase = await res.json()
      guardarPropiedadesLocal(propiedadesBase)
      return propiedadesBase
    }
  } catch (err) {
    console.warn('No se pudo cargar propiedades.json inicial:', err)
  }

  return []
}

/**
 * Obtiene las propiedades asignadas a un agente
 */
export async function obtenerPropiedadesAgente(agenteId) {
  const todas = await obtenerTodasLasPropiedades()
  const idObjetivo = agenteId || obtenerSesion()?.id

  if (!idObjetivo) return todas

  return todas.filter(
    (p) => String(p.agenteId) === String(idObjetivo) || !p.agenteId
  )
}

/**
 * Guarda (crea o edita) una propiedad asignada al agente
 */
export async function guardarPropiedadAgente(propiedadData, agenteId) {
  const todas = await obtenerTodasLasPropiedades()
  const sesion = obtenerSesion()
  const idAgente = agenteId || sesion?.id || 'usr-4'

  let propiedadesActualizadas = []
  let propiedadGuardada = null

  if (propiedadData.id) {
    // Edición
    propiedadesActualizadas = todas.map((p) => {
      if (String(p.id) === String(propiedadData.id)) {
        propiedadGuardada = {
          ...p,
          ...propiedadData,
          precio: Number(propiedadData.precio) || 0,
          amb: Number(propiedadData.amb) || 1,
          banos: Number(propiedadData.banos) || 1,
          m2: Number(propiedadData.m2) || 0,
        }
        return propiedadGuardada
      }
      return p
    })
  } else {
    // Alta / Captación
    const nuevoId = todas.length > 0 ? Math.max(...todas.map((p) => Number(p.id) || 0)) + 1 : 1
    propiedadGuardada = {
      ...propiedadData,
      id: nuevoId,
      agenteId: idAgente,
      estado: propiedadData.estado || 'disponible',
      precio: Number(propiedadData.precio) || 0,
      amb: Number(propiedadData.amb) || 1,
      banos: Number(propiedadData.banos) || 1,
      m2: Number(propiedadData.m2) || 0,
      img: propiedadData.img?.trim() || '/img/propiedades/prop1.jpg',
      clienteId: null,
      propietarioId: propiedadData.propietarioId || sesion?.id || 'usr-2',
    }
    propiedadesActualizadas = [propiedadGuardada, ...todas]
  }

  guardarPropiedadesLocal(propiedadesActualizadas)
  return propiedadGuardada
}

/**
 * Modificación inmediata de estado de una propiedad
 */
export async function cambiarEstadoPropiedad(propiedadId, nuevoEstado) {
  const todas = await obtenerTodasLasPropiedades()
  const actualizadas = todas.map((p) => {
    if (String(p.id) === String(propiedadId)) {
      return { ...p, estado: nuevoEstado }
    }
    return p
  })

  guardarPropiedadesLocal(actualizadas)
  return actualizadas.find((p) => String(p.id) === String(propiedadId))
}

/**
 * Eliminación de una propiedad asignada
 */
export async function eliminarPropiedadAgente(propiedadId) {
  const todas = await obtenerTodasLasPropiedades()
  const filtradas = todas.filter((p) => String(p.id) !== String(propiedadId))
  guardarPropiedadesLocal(filtradas)
  return true
}

// --- AGENDA Y GESTIÓN DE CITAS ---

export async function obtenerTodasLasCitas() {
  const local = obtenerCitasLocal()
  if (local && local.length > 0) {
    return local
  }

  try {
    const res = await fetch(`${URL_BASE}/citas.json`)
    if (res.ok) {
      const citasBase = await res.json()
      guardarCitasLocal(citasBase)
      return citasBase
    }
  } catch (err) {
    console.warn('No se pudo cargar citas.json inicial:', err)
  }

  return []
}

export async function obtenerCitasAgente(agenteId) {
  const [citas, propiedades, usuarios] = await Promise.all([
    obtenerTodasLasCitas(),
    obtenerTodasLasPropiedades(),
    obtenerTodosLosUsuarios(),
  ])

  const idAgente = agenteId || obtenerSesion()?.id

  const citasFiltradas = citas.filter(
    (c) => String(c.agenteId) === String(idAgente) || !c.agenteId
  )

  return citasFiltradas.map((c) => {
    const prop = propiedades.find((p) => String(p.id) === String(c.propiedadId))
    const cliente = usuarios.find((u) => String(u.id) === String(c.clienteId))

    return {
      ...c,
      propiedadTitulo: prop?.titulo || 'Inmueble no especificado',
      propiedadDireccion: prop?.direccion || '',
      propiedadImg: prop?.img || '/img/propiedades/prop1.jpg',
      clienteNombre: cliente?.nombre || 'Cliente interesado',
      clienteEmail: cliente?.email || '',
      clienteTelefono: cliente?.telefono || '',
    }
  })
}

export async function actualizarEstadoCita(citaId, nuevoEstado) {
  const citas = await obtenerTodasLasCitas()
  const actualizadas = citas.map((c) => {
    if (String(c.id) === String(citaId)) {
      return { ...c, estado: nuevoEstado }
    }
    return c
  })

  guardarCitasLocal(actualizadas)
  return actualizadas.find((c) => String(c.id) === String(citaId))
}

// --- DESEMPEÑO Y MÉTRICAS ---

export async function obtenerMetricasDesempeno(agenteId) {
  const [propiedades, citas] = await Promise.all([
    obtenerPropiedadesAgente(agenteId),
    obtenerCitasAgente(agenteId),
  ])

  const totalPropiedades = propiedades.length
  const disponibles = propiedades.filter((p) => p.estado === 'disponible').length
  const reservadas = propiedades.filter((p) => p.estado === 'reservado').length
  const cerradas = propiedades.filter((p) => p.estado === 'vendido' || p.estado === 'alquilado').length

  const citasTotal = citas.length
  const citasPendientes = citas.filter((c) => c.estado === 'pendiente').length
  const citasConfirmadas = citas.filter((c) => c.estado === 'confirmada').length
  const citasCompletadas = citas.filter((c) => c.estado === 'completada').length
  const citasCanceladas = citas.filter((c) => c.estado === 'cancelada').length

  const tasaConversion =
    totalPropiedades > 0 ? Math.round((cerradas / totalPropiedades) * 100) : 0

  const volumenCartera = propiedades.reduce((acc, curr) => acc + (Number(curr.precio) || 0), 0)

  return {
    totalPropiedades,
    disponibles,
    reservadas,
    cerradas,
    citasTotal,
    citasPendientes,
    citasConfirmadas,
    citasCompletadas,
    citasCanceladas,
    tasaConversion,
    volumenCartera,
    propiedadesPorTipo: {
      casas: propiedades.filter((p) => p.categoria === 'casa').length,
      deptos: propiedades.filter((p) => p.categoria === 'departamento').length,
      phs: propiedades.filter((p) => p.categoria === 'ph').length,
      otros: propiedades.filter((p) => !['casa', 'departamento', 'ph'].includes(p.categoria)).length,
    },
  }
}