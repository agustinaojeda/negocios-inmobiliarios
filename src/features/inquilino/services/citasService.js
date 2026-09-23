import { obtenerPropiedades } from "../../inmuebles/services/inmueblesService";
import { obtenerTodosLosUsuarios } from "../../auth/services/authService";
const URL_BASE = '/data';

export async function obtenerCitas() {
  const respuesta = await fetch(`${URL_BASE}/citas.json`);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las citas');
  }
  return respuesta.json();
}

export async function obtenerCitasPorUsuario(usuario) {
  if (!usuario) return [];

  const [citasData, usuariosData, propiedadesData] = await Promise.all([
    obtenerCitas(),
    obtenerTodosLosUsuarios(),
    obtenerPropiedades(),
  ]);

  // filtrar las citas según el rol del usuario logueado
  const citasFiltradas = citasData.filter((cita) => {
    if (usuario.rol === 'admin') return true;
    if (usuario.rol === 'inquilino') return cita.clienteId === usuario.id;
    if (usuario.rol === 'agente') return cita.agenteId === usuario.id;
    if (usuario.rol === 'propietario') return cita.propietarioId === usuario.id;
    return false;
  });

  // enriquecer las citas relacionando los IDs con sus datos completos
  return citasFiltradas.map((cita) => {
    const propiedad = propiedadesData.find((p) => p.id === cita.propiedadId);
    const cliente = usuariosData.find((u) => u.id === cita.clienteId);
    const agente = usuariosData.find((u) => u.id === cita.agenteId);

    return {
      ...cita,
      propiedad: propiedad || {
        titulo: 'Propiedad no encontrada',
        zona: '-',
        img: '/img/propiedades/default.jpg',
      },
      clienteNombre: cliente ? cliente.nombre : 'Cliente no registrado',
      clienteTelefono: cliente ? cliente.telefono : '',
      agenteNombre: agente ? agente.nombre : 'Sin agente asignado',
    };
  });
}

export async function obtenerCitaPorId(id) {
  const citas = await obtenerCitas();
  const cita = citas.find((c) => c.id === Number(id));
  if (!cita) {
    throw new Error('La cita que buscás no existe');
  }
  return cita;
}

export const citasService = {
  getCitasPorUsuario: obtenerCitasPorUsuario,
  getCitaPorId: obtenerCitaPorId,
};