import { obtenerSesion } from "../../auth/services/authService";

const URL_BASE = "http://localhost:3000/api";

function obtenerHeaders() {//como solo los inq pueden poner fav hace falta meter el header para verificar si de verdad se trata de un usuario inq
  const sesion = obtenerSesion();
  const token = sesion?.token; //AJUSTAR SI HACE FALTA CUANDO ESTE LISTO LO DE AUTH !!! D:
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

//obtiene la lista de ids favoritos del usuario actual
export async function obtenerFavoritos() {
  const respuesta = await fetch(`${URL_BASE}/favoritos`, {
    headers: obtenerHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los favoritos");
  }
  const datos = await respuesta.json();
  return datos.favoritos || datos.datos || (Array.isArray(datos) ? datos : []);
}

export async function agregarFavorito(id) {
  const respuesta = await fetch(`${URL_BASE}/favoritos/${id}`, {
    method: "POST",
    headers: obtenerHeaders(),
  });
  if (!respuesta.ok) {
    throw new Error("No se pudo agregar la propiedad a favoritos");
  }
  return respuesta.json();
}

export async function eliminarFavorito(id) {
  const respuesta = await fetch(`${URL_BASE}/favoritos/${id}`, {
    method: "DELETE",
    headers: obtenerHeaders(),
  });
  if (!respuesta.ok && respuesta.status !== 204) {
    throw new Error("No se pudo eliminar la propiedad de favoritos");
  }
  if (respuesta.status === 204) {
    return true;
  }
  return respuesta.json();
}