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
  const rol = sesion?.rol;

  //si es agente o admin se le muestra este activa o no
  if (rol == "agente" || rol == "admin") {
    try {
      return await apiClient.get(`/inmuebles/panel/${id}`);
    } catch (error) {
      throw new Error("No tenés permisos para ver esta propiedad", {
        cause: error,
      });
    }
  }

  try {
    return await apiClient.get(`/inmuebles/${id}`);
  } catch (error) {
    if (rol === "propietario" && error?.status === 404) {
      try {
        return await apiClient.get(`/inmuebles/panel/${id}`);
      } catch (errorPanel) {
        if (errorPanel?.status === 403) {
          throw new Error("No tenés permisos para ver esta propiedad", {
            cause: errorPanel,
          });
        }
        throw new Error("La propiedad que buscás no existe", {
          cause: errorPanel,
        });
      }
    }

    throw new Error("La propiedad que buscás no existe", { cause: error });
  }
}

export async function obtenerUltimas(limite = 3) {
  // devuelve las ultimas tres cargadas y disponibles
  const propiedades = await obtenerPropiedadesDisponibles();
  return propiedades.slice(-limite).reverse();
}

//en este caso se usa como puente ya que obtenerPropiedades la usan varios archivos entonces para no romper nada
export async function obtenerPropiedades() {
  return obtenerPropiedadesDisponibles();
}

// Historial de cambios de precio (solo agente asignado y propietario dueño)
export async function obtenerHistorialPrecios(id) {
  const datos = await apiClient.get(`/inmuebles/${id}/historial-precios`);

  return {
    ...datos,
    precio_actual: Number(datos.precio_actual),
    historial: (datos.historial || []).map((item) => ({
      ...item,
      precio_anterior: Number(item.precio_anterior),
      precio_nuevo: Number(item.precio_nuevo),
    })),
  };
}

// Traduce el error del endpoint a un texto que se pueda mostrar en el modal
export function mensajeErrorHistorial(error) {
  if (error?.status === 403) {
    return "No tenés permisos para ver el historial de este inmueble";
  }
  if (error?.status === 404) {
    return "El inmueble no existe o fue eliminado";
  }
  if (error?.status === 0) {
    return "No se pudo conectar con el servidor. Probá de nuevo.";
  }
  return error?.message || "No se pudo cargar el historial de precios";
}

export async function obtenerInmueblesAsignadosPorUsuario(usuario) {
  if (!usuario) return [];

  // Si es inquilino, sus inmuebles asignados son las operaciones de compra o alquiler cerradas
  if (usuario.rol === 'inquilino') {
    try {
      const respuesta = await apiClient.get('/operaciones');
      const operaciones = respuesta.operaciones || [];

      return operaciones.map((op) => ({
        id: op.propiedad_id,
        titulo: op.propiedad_titulo,
        direccion: op.propiedad_direccion,
        zona: op.propiedad_zona,
        tipo: op.tipo_operacion, // 'venta' o 'alquiler'
        precio: Number(op.monto_cierre),
        moneda: op.moneda,
        img: op.propiedad_img || '/img/propiedades/prop1.jpg',
        imagenes: [op.propiedad_img || '/img/propiedades/prop1.jpg'],
        agenteNombre: `${op.agente_nombre || ''} ${op.agente_apellido || ''}`.trim() || 'Sin asesor asignado',
        clienteNombre: `${op.cliente_nombre || ''} ${op.cliente_apellido || ''}`.trim(),
      }));
    } catch (err) {
      return [];
    }
  }

  // Si es admin o propietario, muestra su filtro correspondiente
  const propiedades = await obtenerPropiedadesDisponibles();
  return propiedades.filter((p) => {
    if (usuario.rol === "propietario") return p.propietario_id === usuario.id;
    if (usuario.rol === "admin") return true;
    return false;
  });
}
