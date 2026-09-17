import { redirect } from 'react-router'

const URL_BASE = '/backend/data'
const CLAVE_SESION = 'indumentaria-sur:sesion'

// ATENCIÓN: esto es SOLO para practicar. En un sistema real las contraseñas
// jamás se descargan ni se comparan en el navegador: lo resuelve el servidor.
export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${URL_BASE}/usuarios.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudo verificar el usuario. Intentá más tarde.')
  }

  const usuarios = await respuesta.json()
  const usuario = usuarios.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  )
  if (!usuario) {
    throw new Error('Email o contraseña incorrectos.')
  }

  // Nunca se guarda la contraseña en la sesión.
  const sesion = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
  return sesion
}

export function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION)
}

// CLASE 3 · React Router: loaders
// Un loader se ejecuta ANTES de mostrar la ruta. Si no hay sesión, lanza un
// redirect y el componente privado nunca llega a dibujarse.
export function protegerRuta() {
  const sesion = obtenerSesion()
  if (!sesion) {
    throw redirect('/login')
  }
  return sesion // lo recibe LayoutGestor con useLoaderData()
}

export function redirigirSiHaySesion() {
  if (obtenerSesion()) {
    throw redirect('/gestor')
  }
  return null
}
