export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000')
  .replace(/\/$/, '')

export const DATA_URL = `${API_BASE_URL}/data`

// El backend devuelve rutas relativas (/img/usuarios/x.jpg) servidas desde public/.
// Las URLs absolutas (http, https, data:, blob:) se devuelven tal cual.
export function resolverUrlImagen(ruta) {
  if (!ruta) return null
  if (/^(https?:|data:|blob:)/i.test(ruta)) return ruta
  return `${API_BASE_URL}${ruta.startsWith('/') ? '' : '/'}${ruta}`
}
