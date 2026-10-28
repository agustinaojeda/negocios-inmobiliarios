import { obtenerSesion } from '../../auth/services/authService';

const URL_BASE = 'http://localhost:3000/api/citas';

// Función auxiliar para obtener el header con el token de autorización
function obtenerHeaders() {
  const sesion = obtenerSesion();
  const token = sesion?.token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Obtener las citas del usuario actual desde la API
export async function obtenerCitasPorUsuario() {
  const respuesta = await fetch(URL_BASE, {
    headers: obtenerHeaders(),
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudieron obtener las citas');
  }

  const datos = await respuesta.json();
  const listaCitas = datos.citas || [];

  // Adaptamos los datos de la base de datos al formato que espera PropertyCard
  return listaCitas.map((c) => ({
    id: c.id,
    inquilinoId: c.inquilino_id,
    propiedadId: c.propiedad_id,
    fecha: c.fecha ? c.fecha.split('T')[0] : '',
    hora: c.hora ? c.hora.slice(0, 5) : '',
    estado: c.estado,
    mensaje: c.mensaje,
    clienteNombre: `${c.cliente_nombre || ''} ${c.cliente_apellido || ''}`.trim() || 'Cliente',
    clienteEmail: c.cliente_email,
    clienteTelefono: c.cliente_telefono,
    agenteNombre: `${c.agente_nombre || ''} ${c.agente_apellido || ''}`.trim() || 'Sin asesor asignado',
    propiedad: {
      id: c.propiedad_id,
      titulo: c.propiedad_titulo,
      direccion: c.propiedad_direccion,
      zona: c.propiedad_zona,
      categoria: c.propiedad_categoria,
      precio: Number(c.propiedad_precio),
      moneda: c.propiedad_moneda,
      img: c.propiedad_img || '/img/propiedades/prop1.jpg',
    },
  }));
}

// Solicitar una nueva cita a través del endpoint POST
export async function solicitarCita({ propiedadId, fecha, hora, mensaje }) {
  const respuesta = await fetch(URL_BASE, {
    method: 'POST',
    headers: obtenerHeaders(),
    body: JSON.stringify({
      propiedadId,
      fecha,
      hora,
      mensaje,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo agendar la cita');
  }

  return datos.cita;
}

// Cancelar una cita
export async function cancelarCita(id) {
  const respuesta = await fetch(`${URL_BASE}/${id}/estado`, {
    method: 'PATCH',
    headers: obtenerHeaders(),
    body: JSON.stringify({ estado: 'cancelada' }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo cancelar la cita');
  }

  return datos.cita;
}

export const citasService = {
  getCitasPorUsuario: obtenerCitasPorUsuario,
  solicitarCita,
  cancelarCita,
};
