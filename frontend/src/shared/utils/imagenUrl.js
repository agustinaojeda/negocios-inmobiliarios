import { API_BASE_URL } from '../config/api'

/**
 * Convierte una ruta relativa de imagen (/img/propiedades/123.jpg) en una URL absoluta para la etiqueta <img />.
 * Usa VITE_API_URL (vía API_BASE_URL) para funcionar tanto en local como en producción.
 */
export function obtenerUrlImagen(url) {
  if (!url) return `${API_BASE_URL}/img/propiedades/prop1.jpg` // Foto fallback si no hay imagen
  if (/^(https?:|data:|blob:)/i.test(url)) return url

  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}
