//busca las propiedades a la bd o json en este caso, es el unico que puede hacer fetch
import { obtenerTodosLosUsuarios } from "../../auth/services/authService";
import { obtenerFavoritos } from "../../inquilino/services/favoritosService";
import { apiClient } from "../../../shared/services/apiClient";
import { obtenerSesion } from "../../auth/services/authService";

export async function obtenerPropiedadesDisponibles(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.categoria && filtros.categoria !== "todas") {
    params.append("categoria", filtros.categoria);
  }
  if (filtros.tipo && filtros.tipo !== "todas") {
    params.append("estado_comercial", filtros.tipo);
  }
  if (filtros.zona && filtros.zona !== "todas") {
    params.append("zona", filtros.zona);
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  try {
    const propiedades = await apiClient.get(`/inmuebles${queryString}`);

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
  } catch (error) {
    throw new Error("No se pudieron obtener las propiedades");
  }
}

export async function obtenerPropiedadPorId(id) {
  const sesion = obtenerSesion();

  //si es agente o admin se le muestra este activa o no
  if (sesion && (sesion.rol == "agente" || sesion.rol == 'admin')) {
    try {
      return await apiClient.get(`/inmuebles/panel/${id}`);
    } catch (error) {
      throw new Error("No tenés permisos para ver esta propiedad");
    }
  } else {
    try{
      return await apiClient.get(`/inmuebles/${id}`);
    }catch(error){
      throw new Error("La propiedad que buscás no existe");
    }
  }
}

export async function obtenerUltimas(limite = 3) {
  //devuelve las ultimas tres cargadas y disponibles
  const propiedades = await obtenerPropiedadesDisponibles();
  return propiedades.slice(-limite).reverse();
}

//en este caso se usa como puente ya que obtenerPropiedades la usan varios archivos entonces para no romper nada
export async function obtenerPropiedades() {
  return obtenerPropiedadesDisponibles();
}

export async function obtenerInmueblesAsignadosPorUsuario(usuario) {
  if (!usuario) return [];

  const [propiedades, usuarios] = await Promise.all([
    obtenerPropiedades(),
    obtenerTodosLosUsuarios(),
  ]);

  const asignados = propiedades.filter((p) => {
    if (usuario.rol === "inquilino") return p.clienteId === usuario.id;
    if (usuario.rol === "propietario") return p.propietarioId === usuario.id;
    if (usuario.rol === "admin") return true;
    return false;
  });

  return asignados.map((p) => {
    const agente = usuarios.find((u) => u.id === p.agenteId);
    return {
      ...p,
      agenteNombre: agente ? agente.nombre : "Sin asesor asignado",
    };
  });
}
