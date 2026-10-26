// Cliente HTTP centralizado.
// Todos los services del frontend deben pedir datos al backend a través de
// este archivo: así el token y los errores 401 se manejan en un solo lugar.

const API_URL = `${(import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')}/api`

const CLAVE_TOKEN = 'negocios-inmobiliarios:token'
const CLAVE_SESION = 'negocios-inmobiliarios:sesion'

// En estas rutas un 401 significa "credenciales incorrectas", no "sesión vencida",
// así que NO se borra la sesión ni se redirige: el formulario muestra el error.
const RUTAS_PUBLICAS_AUTH = ['/auth/login', '/auth/registro']

// ---------- Manejo de sesión (localStorage) ----------

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function obtenerSesionGuardada() {
  if (!obtenerToken()) return null
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function guardarSesion(token, usuario) {
  if (token) localStorage.setItem(CLAVE_TOKEN, token)
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_TOKEN)
  localStorage.removeItem(CLAVE_SESION)
}

// ---------- Errores ----------

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status // 0 = no hubo respuesta (servidor caído / sin red)
    this.data = data
  }
}

// ---------- Petición central ----------

async function request(method, endpoint, body, options = {}) {
  const { sinRedireccion = false, headers: headersExtra = {}, ...resto } = options

  // Interceptor de request: headers por defecto + token si hay sesión activa
  const headers = { Accept: 'application/json', ...headersExtra }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = obtenerToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...resto,
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  // Parseo seguro: 204 o body vacío -> null
  const texto = await respuesta.text()
  let data = null
  if (texto) {
    try {
      data = JSON.parse(texto)
    } catch {
      data = texto
    }
  }

  // Interceptor de response: token vencido o inválido
  if (respuesta.status === 401) {
    const esRutaPublica = RUTAS_PUBLICAS_AUTH.some((ruta) => endpoint.startsWith(ruta))
    if (!esRutaPublica && !sinRedireccion) {
      borrarSesion()
      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }
  }

  if (!respuesta.ok) {
    const mensaje = data?.error || data?.message || `Error ${respuesta.status}`
    throw new ApiError(respuesta.status, mensaje, data)
  }

  return data
}

// ---------- Métodos estándar ----------

export const apiClient = {
  get: (url, options) => request('GET', url, undefined, options),
  post: (url, body, options) => request('POST', url, body, options),
  put: (url, body, options) => request('PUT', url, body, options),
  delete: (url, options) => request('DELETE', url, undefined, options),
}

export default apiClient
