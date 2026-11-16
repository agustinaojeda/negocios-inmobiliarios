import { apiClient } from './apiClient'

// Normaliza la fila que devuelve GET /citas/:id (snake_case de PostgreSQL)
// al formato que consume el modal de detalle.
function normalizarDetalleCita(cita) {
  const clienteNombre = `${cita.cliente_nombre || ''} ${cita.cliente_apellido || ''}`.trim()
  const agenteNombre = `${cita.agente_nombre || ''} ${cita.agente_apellido || ''}`.trim()

  return {
    id: cita.id,
    fecha: cita.fecha ? String(cita.fecha).split('T')[0] : '',
    hora: cita.hora ? String(cita.hora).slice(0, 5) : '',
    estado: cita.estado,
    mensaje: cita.mensaje || '',
    fechaCreacion: cita.fecha_creacion ? String(cita.fecha_creacion).split('T')[0] : '',
    propiedad: {
      id: cita.propiedad_id,
      titulo: cita.propiedad_titulo || 'Inmueble no especificado',
      direccion: cita.propiedad_direccion || '',
      zona: cita.propiedad_zona || '',
      categoria: cita.propiedad_categoria || '',
      precio: cita.propiedad_precio !== null ? Number(cita.propiedad_precio) : null,
      moneda: cita.propiedad_moneda || '',
      img: cita.propiedad_img || '/img/propiedades/prop1.jpg',
    },
    cliente: {
      nombre: clienteNombre || 'Cliente interesado',
      email: cita.cliente_email || '',
      telefono: cita.cliente_telefono || '',
    },
    agente: {
      nombre: agenteNombre || 'Sin asesor asignado',
      telefono: cita.agente_telefono || '',
    },
    propietarioId: cita.propietario_id,
    agenteId: cita.agente_id,
  }
}

// Detalle de una cita. El backend valida permisos por rol (401/403/404).
export async function obtenerCitaDetalle(id) {
  const cita = await apiClient.get(`/citas/${id}`)
  return normalizarDetalleCita(cita)
}
