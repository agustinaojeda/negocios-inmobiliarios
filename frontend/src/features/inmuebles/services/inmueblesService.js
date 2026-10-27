//busca las propiedades a la bd o json en este caso, es el unico que puede hacer fetch
import { obtenerTodosLosUsuarios } from "../../auth/services/authService"
import { obtenerFavoritos } from "../../inquilino/services/favoritosService"
import { obtenerToken } from "../../../shared/services/apiClient"

const URL_BASE = 'http://localhost:3000/api'
const URL_BASE2 = '/data'

export async function obtenerPropiedadesDisponibles(filtros = {}){ 
  const params = new URLSearchParams()

  if (filtros.categoria && filtros.categoria !== 'todas') {
    params.append('categoria', filtros.categoria)
  }
  if (filtros.tipo && filtros.tipo !== 'todas') {
    params.append('estado_comercial', filtros.tipo)
  }
  if (filtros.zona && filtros.zona !== 'todas') {
    params.append('zona', filtros.zona)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ''
  const respuesta = await fetch(`${URL_BASE}/inmuebles${queryString}`)

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las propiedades')
  }

  const propiedades = await respuesta.json();
  let favsIds = new Set();
  try {
    const listaFavs = await obtenerFavoritos();
    favsIds = new Set(listaFavs.map((f) => Number(f.id)));
  } catch (err) {
    //si no esta autenticado o falla la ruta de favoritos continuamos con el array de ids vacio
  }

  //si esta en favorito lo marca sino no (es para pintar el corazoncito)
  return propiedades.map((p) => ({
    ...p,
    es_favorito: favsIds.has(Number(p.id)),
  }));
}

export async function obtenerPropiedadPorId(id) {
  const token = obtenerToken();
  const respuesta = await fetch(`${URL_BASE}/inmuebles/${id}`);

  if (respuesta.ok) {
    return await respuesta.json();
  }
  
  if(token){
    const agenteRta = await fetch(`${URL_BASE}/inmuebles/panel/${id}`, {
    headers: obtenerHeaders(),
  });
    if(agenteRta.ok){
      return await agenteRta.json();
    }
  }

  throw new Error('La propiedad que buscás no existe')
}


export async function obtenerUltimas(limite = 3){ //devuelve las ultimas tres cargadas y disponibles
    const propiedades = await obtenerPropiedadesDisponibles();
    return propiedades.slice(-limite).reverse();
}

function obtenerHeaders() {
  const token = obtenerToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


//sacan los datos del json, no lo borro por las dudas

export async function obtenerPropiedades() { //devuelve todas
  const respuesta = await fetch(`${URL_BASE2}/propiedades.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las propiedades')
  }
  return respuesta.json()
}

export async function obtenerInmueblesAsignadosPorUsuario(usuario) {
  if (!usuario) return [];

  const [propiedades, usuarios] = await Promise.all([
    obtenerPropiedades(),
    obtenerTodosLosUsuarios()
  ]);

  const asignados = propiedades.filter((p) => {
    if (usuario.rol === 'inquilino') return p.clienteId === usuario.id;
    if (usuario.rol === 'propietario') return p.propietarioId === usuario.id;
    if (usuario.rol === 'admin') return true;
    return false;
  });

  return asignados.map((p) => {
    const agente = usuarios.find((u) => u.id === p.agenteId);
    return {
      ...p,
      agenteNombre: agente ? agente.nombre : 'Sin asesor asignado'
    };
  });
}