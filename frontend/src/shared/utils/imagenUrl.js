const API_URL_STATIC = 'http://localhost:3000'

/**
 * Convierte una ruta relativa de imagen (/uploads/123.jpg) en una URL absoluta para la etiqueta <img />
 */
export function obtenerUrlImagen(url) {
  if (!url) return `${API_URL_STATIC}/img/propiedades/prop1.jpg` // Foto fallback si no hay imagen

  return `${API_URL_STATIC}/${url}`
}