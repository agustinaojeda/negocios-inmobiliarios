import { redirect } from 'react-router'

const URL_BASE = '/backend/data'
const CLAVE_SESION = 'negocios-inmobiliarios:sesion'
const CLAVE_USUARIOS_REGISTRADOS = 'negocios-inmobiliarios:usuarios_registrados'

function obtenerUsuariosRegistradosLocal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS)) || []
  } catch {
    return []
  }
}

async function obtenerTodosLosUsuarios() {
  let usuariosBase = []
  try {
    const respuesta = await fetch(`${URL_BASE}/usuarios.json`)
    if (respuesta.ok) {
      usuariosBase = await respuesta.json()
    }
  } catch (error) {
    console.warn('No se pudo cargar usuarios.json base:', error)
  }

  const usuariosRegistrados = obtenerUsuariosRegistradosLocal()
  return [...usuariosBase, ...usuariosRegistrados]
}
export async function registrarUsuario({ nombre, email, password, telefono, rol = 'inquilino' }) {
  const emailLimpio = email.trim().toLowerCase()
  const usuarios = await obtenerTodosLosUsuarios()

  // 1. Verificar si ya existe una cuenta con ese correo
  const yaExiste = usuarios.some((u) => u.email.toLowerCase() === emailLimpio)
  if (yaExiste) {
    throw new Error('Ya existe una cuenta registrada con este correo electrónico.')
  }

  // 2. Crear el nuevo usuario
  const nuevoUsuario = {
    id: `usr-${Date.now()}`,
    nombre: nombre.trim(),
    email: emailLimpio,
    password,
    telefono: telefono?.trim() || '',
    rol,
  }

  // 3. Guardar en localStorage para que luego pueda iniciar sesión
  const registrados = obtenerUsuariosRegistradosLocal()
  registrados.push(nuevoUsuario)
  localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(registrados))

  return {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    rol: nuevoUsuario.rol,
  }
}


// ATENCIÓN: esto es SOLO para practicar. En un sistema real las contraseñas
// jamás se descargan ni se comparan en el navegador: lo resuelve el servidor.
export async function iniciarSesion(email, password) {
  const usuarios = await obtenerTodosLosUsuarios()
  const emailLimpio = email.trim().toLowerCase()

  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === emailLimpio && u.password === password,
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

export function obtenerRutaPorRol(rol) {
  switch (rol) {
    case 'admin':
      return '/admin'
    case 'propietario':
      return '/propietario'
    case 'inquilino':
    default:
      return '/inquilino'
  }
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
