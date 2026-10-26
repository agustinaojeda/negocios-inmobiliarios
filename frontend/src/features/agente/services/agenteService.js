import { obtenerSesion, obtenerTodosLosUsuarios } from '../../auth/services/authService'

const URL_BASE2 = '/data'
const CLAVE_PROPIEDADES = 'negocios-inmobiliarios:propiedades'
const CLAVE_CITAS = 'negocios-inmobiliarios:citas'

const URL_BASE = 'http://localhost:3000/api'

function obtenerHeadersAuth() {
  const sesion = obtenerSesion()
  const token = sesion?.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// --- UTILIDADES LOCAL STORAGE ---

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
 * Obtiene todas las propiedades desde la api
 */
export async function obtenerTodasLasPropiedades() {
  try {
    const res = await fetch(`${URL_BASE}/inmuebles/panel`, {
      headers: {
        'Content-Type': 'application/json',
        ...obtenerHeadersAuth(),
      },
    })

    const datos = await res.json()

    if (!res.ok) {
      throw new Error(datos.error || 'Error al obtener la lista de inmuebles')
    }

    return Array.isArray(datos) ? datos : datos.propiedades || []
  } catch (err) {
    console.warn('No se pudo cargar propiedades.json inicial:', err)
    return []
  }
}
/**
 * Obtiene las propiedades asignadas a un agente
 */
export async function obtenerPropiedadesAgente(agenteId) {
  const propiedades = await obtenerTodasLasPropiedades()
  return propiedades

}

/**
 * Guarda (crea o edita) una propiedad asignada al agente
 */
export async function guardarPropiedadAgente(propiedadFormData) {
  const id = propiedadFormData.get('id');
  const esEdicion = Boolean(id);

  const url = esEdicion ? `${URL_BASE}/inmuebles/${id}` : `${URL_BASE}/inmuebles`;
  const method = esEdicion ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      ...obtenerHeadersAuth(),
    },
    body: propiedadFormData,
  });

  const datos = await res.json();
  if (!res.ok) throw new Error(datos.error || 'Error al guardar el inmueble');
  return datos;
}

/**
 * Obtiene la lista de propietarios para el selector del modal
 * AJUSTAR CUANDO ESTE LISTO LO DE AUTH POR AHORA NO ANDA
 */
export async function obtenerPropietarios() {
  try {
    const res = await fetch(`${URL_BASE}/usuarios`, {
      headers: {
        'Content-Type': 'application/json',
        ...obtenerHeadersAuth(),
      },
    })
    if (!res.ok) throw new Error('Error al obtener la lista de propietarios')
    const datos = await res.json()
    const lista = Array.isArray(datos) ? datos : datos.usuarios || []
    return lista.filter((u) => u.rol === 'propietario')
  } catch (err) {
    console.error('Error al obtener propietarios:', err)
    return []
  }
}

/**
 * Eliminación de una propiedad asignada
 */
export async function eliminarPropiedadAgente(propiedadId) {
  const res = await fetch(`${URL_BASE}/inmuebles/${propiedadId}`, {
    method: 'DELETE',
    headers: obtenerHeadersAuth(),
  })

  if (!res.ok) {
    const datos = await res.json().catch(() => ({}))
    throw new Error(datos.error || 'Error al eliminar la propiedad')
  }

  return true
}

/**
 * Reactiva una propiedad previamente inhabilitada
 */
export async function activarPropiedadAgente(propiedadId) {
  const res = await fetch(`${URL_BASE}/inmuebles/${propiedadId}/activar`, {
    method: 'PATCH',
    headers: obtenerHeadersAuth(),
  })

  if (!res.ok) {
    const datos = await res.json().catch(() => ({}))
    throw new Error(datos.error || 'Error al activar la propiedad')
  }

  return true
}

export async function eliminarImagenPropiedad(imagenId) {
  const res = await fetch(`${URL_BASE}/inmuebles/imagenes/${imagenId}`, {
    method: 'DELETE',
    headers: obtenerHeadersAuth(),
  });

  if (!res.ok) {
    const datos = await res.json().catch(() => ({}));
    throw new Error(datos.error || 'Error al eliminar la imagen');
  }

  return true;
}

// --- AGENDA Y GESTIÓN DE CITAS ---

/**
 * Obtiene las citas del agente asignado desde la API de backend
 */
export async function obtenerCitasAgente() {
  try {
    const res = await fetch(`${URL_BASE}/citas`, {
      headers: {
        'Content-Type': 'application/json',
        ...obtenerHeadersAuth(),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al obtener citas del agente');
    }

    const datos = await res.json();
    const lista = datos.citas || [];

    return lista.map((c) => ({
      id: c.id,
      clienteId: c.inquilino_id,
      propiedadId: c.propiedad_id,
      agenteId: c.agente_id,
      fecha: c.fecha ? c.fecha.split('T')[0] : '',
      hora: c.hora ? c.hora.slice(0, 5) : '',
      estado: c.estado,
      mensaje: c.mensaje,
      propiedadTitulo: c.propiedad_titulo || 'Inmueble no especificado',
      propiedadDireccion: c.propiedad_direccion || '',
      propiedadImg: c.propiedad_img || '/img/propiedades/prop1.jpg',
      clienteNombre: `${c.cliente_nombre || ''} ${c.cliente_apellido || ''}`.trim() || 'Cliente interesado',
      clienteEmail: c.cliente_email || '',
      clienteTelefono: c.cliente_telefono || '',
    }));
  } catch (err) {
    console.error('Error al obtener citas del agente:', err);
    return [];
  }
}

/**
 * Actualiza el estado de una cita (confirmada, cancelada, completada, pendiente) en la BD
 */
export async function actualizarEstadoCita(citaId, nuevoEstado) {
  const res = await fetch(`${URL_BASE}/citas/${citaId}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...obtenerHeadersAuth(),
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  const datos = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(datos.error || 'Error al actualizar el estado de la visita');
  }

  return datos.cita;
}
