import { redirect } from 'react-router'
import {
  apiClient,
  obtenerSesionGuardada,
  guardarSesion,
  borrarSesion,
} from '../../../shared/services/apiClient'

// Mock local: solo lo siguen usando obtenerTodosLosUsuarios y cambiarPassword,
// que todavía no tienen endpoint en el backend.
const URL_BASE = 'data'
const CLAVE_USUARIOS_REGISTRADOS = 'negocios-inmobiliarios:usuarios_registrados'

function obtenerUsuariosRegistradosLocal() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS)) || []
  } catch {
    return []
  }
}

export async function obtenerTodosLosUsuarios() {
  let usuariosBase = []
  try {
    const respuesta = await fetch(`${URL_BASE}/usuarios`)
    if (respuesta.ok) {
      usuariosBase = await respuesta.json()
    }
  } catch (error) {
    console.warn('No se pudo cargar usuarios.json base:', error)
  }

  const usuariosRegistrados = obtenerUsuariosRegistradosLocal()

  // Usamos un Map por email para fusionar las dos listas:
  // Si un usuario de usuarios.json se editó y guardó en localStorage, 
  // la versión de localStorage SOBRESCRIBE a la vieja del JSON.
  const mapaUsuarios = new Map()

  usuariosBase.forEach((u) => mapaUsuarios.set(u.email, u))
  usuariosRegistrados.forEach((u) => mapaUsuarios.set(u.email, u))

  return Array.from(mapaUsuarios.values())
}

export async function registrarUsuario({ nombre, apellido = '', email, password, telefono, rol = 'inquilino' }) {
  // El backend valida, hashea la contraseña y responde 409 si el email ya existe.
  // El mensaje de error llega en err.message y lo muestra FormularioRegistro.
  return apiClient.post('/auth/registro', {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    email: email.trim().toLowerCase(),
    password,
    telefono: telefono?.trim() || undefined,
    rol,
  })
}

// El servidor compara la contraseña y devuelve { token, usuario }.
// Guardamos ambos en localStorage: el token lo usa apiClient en cada petición.
export async function iniciarSesion(email, password) {
  try {
    const { token, usuario } = await apiClient.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    })
    guardarSesion(token, usuario)
    return usuario
  } catch (error) {
    if (error.status === 401) {
      throw new Error('Email o contraseña incorrectos.', { cause: error })
    }
    throw error
  }
}

// Sesión local (sin consultar al servidor). Devuelve null si no hay token.
export function obtenerSesion() {
  return obtenerSesionGuardada()
}

// Valida el token contra el servidor y devuelve los datos que trae el JWT.
export function obtenerPerfil(options) {
  return apiClient.get('/auth/perfil', options)
}

//actualizar datos del usuario activo
export function actualizarSesion(datosNuevos) {
  const sesionActual = obtenerSesion() || {}
  const sesionActualizada = { ...sesionActual, ...datosNuevos }

  // 1. Actualizamos la sesión activa (el token no cambia)
  guardarSesion(null, sesionActualizada)

  // 2. Guardamos en localStorage
  try {
    const registrados = obtenerUsuariosRegistradosLocal()
    const indice = registrados.findIndex((u) => u.email === sesionActual.email)

    if (indice !== -1) {
      registrados[indice] = { ...registrados[indice], ...datosNuevos }
    } else {
      registrados.push(sesionActualizada)
    }

    localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(registrados))
  } catch (error) {
    console.error('Error al actualizar en localStorage:', error)
  }

  // Avisamos a toda la app que la sesión se actualizó
  window.dispatchEvent(new Event('sesionActualizada'))

  return sesionActualizada
}

export function cerrarSesion() {
  borrarSesion()
}

export function obtenerRutaPorRol(rol) {
  switch (rol) {
    case 'admin':
      return '/admin'
    case 'propietario':
      return '/propietario'
    case 'agente':
      return '/agente'
    case 'inquilino':
    default:
      return '/inquilino'
  }
}

// CLASE 3 · React Router: loaders
// Un loader se ejecuta ANTES de mostrar la ruta. Si no hay sesión, lanza un
// redirect y el componente privado nunca llega a dibujarse.
// Además valida el token contra el servidor: si venció o es inválido, se
// borra la sesión y se redirige a /login sin llegar a mostrar el panel.
export async function protegerRuta() {
  const sesion = obtenerSesion()
  if (!sesion) {
    throw redirect('/login')
  }

  try {
    // sinRedireccion: el 401 lo resolvemos acá con redirect() de React Router
    const perfil = await obtenerPerfil({ sinRedireccion: true })
    return { ...sesion, ...perfil } // lo recibe LayoutPrivado con useLoaderData()
  } catch (error) {
    if (error.status === 401) {
      borrarSesion()
      throw redirect('/login')
    }
    // Servidor caído u otro error: no deslogueamos al usuario
    return sesion
  }
}

export function redirigirSiHaySesion() {
  const sesion = obtenerSesion()
  if (sesion) {
    throw redirect(obtenerRutaPorRol(sesion.rol))
  }
  return null
}

export async function cambiarPassword(passwordActual, passwordNueva) {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw new Error('No hay una sesión activa.');
  }

  //obtenemos todos los usuarios
  const usuarios = await obtenerTodosLosUsuarios();
  const usuarioEncontrado = usuarios.find(
    (u) => u.email.toLowerCase() === sesion.email.toLowerCase()
  );

  //verificar que la contra que puso es la que tiene
  if (!usuarioEncontrado || usuarioEncontrado.password !== passwordActual) {
    throw new Error('La contraseña actual es incorrecta.');
  }

  //actualizar cambios
  const registrados = obtenerUsuariosRegistradosLocal();
  const indice = registrados.findIndex(
    (u) => u.email.toLowerCase() === sesion.email.toLowerCase()
  );

  if (indice !== -1) {
    registrados[indice].password = passwordNueva;
  } else {
    registrados.push({
      ...usuarioEncontrado,
      password: passwordNueva,
    });
  }

  localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(registrados));
  return true;
}