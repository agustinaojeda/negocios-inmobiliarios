import { apiClient } from "../../../shared/services/apiClient";
import { obtenerSesion } from "../../auth/services/authService";

//obtiene la lista favoritos del usuario actual
export async function obtenerFavoritos() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.rol != 'inquilino') {
    return [];
  }
  try{
    const datos = await apiClient.get('/favoritos');
    return datos.favoritos;
  }catch(error){
    throw new Error('No se pudieron obtener los favoritos');
  }
}

export async function agregarFavorito(id) {
  try{
    const respuesta = await apiClient.post(`/favoritos/${id}`);
    return respuesta;
  }catch(error){
    throw new Error("No se pudo agregar la propiedad a favoritos");
  }
}

export async function eliminarFavorito(id) {
  try{
    await apiClient.delete(`/favoritos/${id}`);
    return true;
  }catch(error){
    throw new Error("No se pudo eliminar la propiedad de favoritos");
  }
}