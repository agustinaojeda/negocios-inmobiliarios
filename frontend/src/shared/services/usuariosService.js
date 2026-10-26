// Service de usuarios: consume /api/usuarios del backend.
import { apiClient } from './apiClient'
import { actualizarSesion } from '../../features/auth/services/authService'

// ---------- Usuario logueado ----------

export function obtenerMiPerfil() {
  return apiClient.get('/usuarios/perfil')
}

// Envía multipart/form-data porque puede incluir la foto (campo "foto")
export async function actualizarMiPerfil({ nombre, apellido, telefono, foto }) {
  const formData = new FormData()
  formData.append('nombre', nombre.trim())
  formData.append('apellido', apellido.trim())
  formData.append('telefono', (telefono || '').trim())
  if (foto) formData.append('foto', foto)

  const usuario = await apiClient.put('/usuarios/perfil', formData)

  // Sincroniza la sesión local y avisa a la app (navbar, etc.)
  actualizarSesion({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    telefono: usuario.telefono,
    fotoPerfil: usuario.fotoPerfil,
  })

  return usuario
}

export function cambiarPassword(passwordActual, passwordNueva) {
  return apiClient.patch('/usuarios/cambiar-password', { passwordActual, passwordNueva })
}

// ---------- Admin ----------

export function listarUsuarios() {
  return apiClient.get('/usuarios')
}

export function cambiarEstadoUsuario(id, estaActivo) {
  return apiClient.patch(`/usuarios/${id}/estado`, { estaActivo })
}
