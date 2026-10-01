import { redirect } from 'react-router'

const URL_BASE = 'data'
const CLAVE_SESION = 'negocios-inmobiliarios:sesion'
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
    const respuesta = await fetch(`${URL_BASE}/usuarios.json`)
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

export async function registrarUsuario({ nombre, email, password, telefono, rol = 'inquilino' }) {
  const emailLimpio = email.trim().toLowerCase()
  const usuarios = await obtenerTodosLosUsuarios()

  // 1. Verificar si ya existe una cuenta con ese correo
  const yaExiste = usuarios.some((u) => u.email.toLowerCase() === emailLimpio)
  //some devuelve valor booleano si cumple la condicion, si no la cumple devuelve undefined
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
    fotoPerfil: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=13284c&color=fff`,
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
    telefono: nuevoUsuario.telefono,
    fotoPerfil: nuevoUsuario.fotoPerfil,
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
  const sesion = { 
    id: usuario.id, 
    nombre: usuario.nombre, 
    email: usuario.email, 
    telefono: usuario.telefono,
    fotoPerfil: usuario.fotoPerfil,
    rol: usuario.rol 
  }
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

//actualizar datos del usuario activo
export function actualizarSesion(datosNuevos) {
  const sesionActual = obtenerSesion() || {}
  const sesionActualizada = { ...sesionActual, ...datosNuevos }

  // 1. Guardamos en sessionStorage
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesionActualizada))

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
  sessionStorage.removeItem(CLAVE_SESION)
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
export function protegerRuta() {
  const sesion = obtenerSesion()
  if (!sesion) {
    throw redirect('/login')
  }
  return sesion // lo recibe LayoutPrivado con useLoaderData()
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