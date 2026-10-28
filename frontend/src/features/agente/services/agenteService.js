import { obtenerSesion, obtenerTodosLosUsuarios } from '../../auth/services/authService'
import { apiClient } from '../../../shared/services/apiClient'
import { obtenerToken } from '../../../shared/services/apiClient'

const URL_BASE2 = '/data'
const CLAVE_PROPIEDADES = 'negocios-inmobiliarios:propiedades'
const CLAVE_CITAS = 'negocios-inmobiliarios:citas'

const URL_BASE = 'http://localhost:3000/api'

function obtenerHeadersAuth() {
  const token = obtenerToken();
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
    const datos = await apiClient.get(`/inmuebles/panel`);
    return Array.isArray(datos) ? datos : datos.propiedades || []
  } catch (err) {
    console.warn('No se pudo cargar propiedades.json inicial:', err)
    return []
  }
}
/**
 * Obtiene las propiedades asignadas a un agente
 */
export async function obtenerPropiedadesAgente() {
  const propiedades = await obtenerTodasLasPropiedades()
  return propiedades

}

/**
 * Guarda (crea o edita) una propiedad asignada al agente
 */
export async function guardarPropiedadAgente(propiedadFormData) {
  try {
    const id = propiedadFormData.get('id');
    const esEdicion = Boolean(id);

    // Se pasa propiedadFormData directamente como segundo argumento
    const datos = esEdicion
      ? await apiClient.put(`/inmuebles/${id}`, propiedadFormData)
      : await apiClient.post('/inmuebles', propiedadFormData);

    return datos;
  } catch (error) {
    throw new Error(error.message || 'Error al guardar el inmueble');
  }
}
/**
 * Obtiene la lista de propietarios para el selector del modal
 */
export async function obtenerPropietarios() {
  try {
    const datos = await apiClient.get('/usuarios/');
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
  try{
    return await apiClient.delete(`/inmuebles/${propiedadId}`);
  }catch(error){
    throw new Error('Error al eliminar la propiedad')
  }
}

/**
 * Reactiva una propiedad previamente inhabilitada
 */
export async function activarPropiedadAgente(propiedadId) {
  try{
    return await apiClient.patch(`/inmuebles/${propiedadId}/activar`,{propiedadId});
  }catch(error){
    throw new Error('Error al activar la propiedad')
  }
}

export async function eliminarImagenPropiedad(imagenId) {
  try{
    return await apiClient.delete(`/inmuebles/imagenes/${imagenId}`);
  }catch(error){
    throw new ('Error al eliminar la imagen');
  }
}

// --- AGENDA Y GESTIÓN DE CITAS ---

/**
 * Obtiene las citas del agente asignado desde la API de backend
 */
export async function obtenerCitasAgente() {
  try {
    const datos = await apiClient.get('/citas');

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
  try{
    const datos = await apiClient.patch(`/citas/${citaId}/estado`,{estado : nuevoEstado});
    return datos.cita;
  }catch(error){
    throw new Error('Error al actualizar el estado de la visita');
  }
}
