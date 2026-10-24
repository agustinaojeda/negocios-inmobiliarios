//valida los datos y si necesita algo de info lo llama al repository
import { errorHandler } from "../../shared/middlewares/errorHandler.js";
import * as repository from "./inmuebles.repository.js";

export const listar = async (filtros, esAgente = false) => {
  const propiedades = await repository.listar(filtros, esAgente);

  if (!propiedades || propiedades.length === 0) {
    return [];
  }

  //saca los ids para despues buscar sus imgs
  const ids = propiedades.map((p) => p.id);

  const imagenes = await repository.obtenerImagenes(ids);

  //se asocia cada imagen con su propiedad
  return propiedades.map((propiedad) => ({
    ...propiedad,
    imagenes: imagenes.filter((img) => img.propiedad_id === propiedad.id),
  }));
};

export const obtener = async (id, esAgente = false) => {
  const propiedad = await repository.obtener(id, esAgente);

  if (!propiedad) return null; //el controlador se encarga de avisar que no se encontro

  const imagenes = await repository.obtenerImagenes([id]);

  return { ...propiedad, imagenes: imagenes };
};

export const crear = async (datos, id) => {
  const errorValidacion = validar(datos);
  if (errorValidacion) {
    return errorValidacion;
  }

  const { propietario_id, imagenes } = datos;

  if (propietario_id) {
    const esValido = await repository.esPropietario(propietario_id);
    if (!esValido) {
      return {
        error:
          "El propietario especificado no existe, está inactivo o no posee el rol de propietario",
      };
    }
  }

  //si esta todo bien lo manda al repository
  const datosCompletos = {
    ...datos,
    propietario_id: propietario_id || null,
    agente_id: id,
  };

  const nuevaPropiedad = await repository.crear(datosCompletos);
  const imagenesGuardadas = await repository.guardarImagenes(
    nuevaPropiedad.id,
    imagenes,
  );

  return {
    ...nuevaPropiedad,
    imagenes: imagenesGuardadas,
  };
};

export const actualizar = async (id, datos, agenteId) => {
  //guarda cambios y si hubo variaciones en el precio lo mete en la tabla historial
  const propiedadExistente = await repository.obtener(id, true);
  if (!propiedadExistente) {
    return null;
  }

  if (propiedadExistente.agente_id !== agenteId) {
    return {
      forbidden: true,
    };
  }

  const errorValidacion = validar(datos);
  if (errorValidacion) {
    return errorValidacion;
  }

  const { propietario_id, imagenes, precio } = datos;

  if (propietario_id) {
    const esValido = await repository.esPropietario(propietario_id);
    if (!esValido) {
      return {
        error:
          "El propietario especificado no existe, está inactivo o no posee el rol de propietario",
      };
    }
  }

  const precioAnterior = Number(propiedadExistente.precio);
  const precioNuevo = Number(precio);

  const datosCompletos = {
    ...datos,
    propietario_id: propietario_id || null,
    agente_id: agenteId,
  };

  const propiedadActualizada = await repository.actualizar(id, datosCompletos);

  if (!isNaN(precioNuevo) && precioAnterior !== precioNuevo) {
    await repository.registrarHistorialPrecio(id, precioAnterior, precioNuevo);
  }

  let imagenesGuardadas = [];
  if (imagenes && imagenes.length > 0) {
    await repository.eliminarImagenes(id);
    imagenesGuardadas = await repository.guardarImagenes(id, imagenes);
  } else {
    imagenesGuardadas = await repository.obtenerImagenes(id);
  }

  return {
    ...propiedadActualizada,
    imagenes: imagenesGuardadas,
  };
};

export const eliminar = async (id, agenteId) => {
  const propiedad = await repository.obtener(id, true);

  if (!propiedad) {
    return null;
  }

  if (propiedad.agente_id !== agenteId) {
    return {
      forbidden: true,
    };
  }

  if (propiedad.estado_visibilidad == "inactivo") {
    return { error: "Esta propiedad ya se ha dado de baja anteriormente." };
  }

  const propiedadEliminada = await repository.darDeBaja(id);
  return propiedadEliminada;
};

export const activar = async (id, agenteId) => {
  const propiedad = await repository.obtener(id, true);
  if (!propiedad) {
    return null;
  }

  if (propiedad.agente_id !== agenteId) {
    return {
      forbidden: true,
    };
  }

  if (propiedad.estado_visibilidad == "activo") {
    return { error: "Esta propiedad ya se encuentra activa." };
  }

  const propiedadActivada = await repository.activar(id);
  return propiedadActivada;
};

//historial
export const obtenerHistorialPrecios = async (id, usuario) => {
  const propiedad = await repository.obtener(id, true);
  if (!propiedad) {
    return null;
  }

  const esSuAgente = propiedad.agente_id === usuario.id;
  const esSuPropietario = propiedad.propietario_id === usuario.id;

  if (!esSuAgente && !esSuPropietario) {
    return { forbidden: true };
  }

  const historial = await repository.obtenerHistorialPrecios(id);

  return {
    propiedad_id: propiedad.id,
    precio_actual: propiedad.precio,
    moneda: propiedad.moneda,
    historial,
  };
};

//validacion
function validar(datos) {
  const {
    titulo,
    categoria,
    moneda,
    precio,
    direccion,
    zona,
    ambientes,
    banos,
    m2,
    estado_comercial,
    imagenes,
  } = datos;

  if (
    !titulo ||
    !categoria ||
    !moneda ||
    !precio ||
    !direccion ||
    !zona ||
    !ambientes ||
    !banos ||
    !m2 ||
    !estado_comercial
  ) {
    return { error: "Faltan campos obligatorios" };
  }

  if (titulo.trim().length < 5) {
    return { error: "El título debe contener al menos 5 caracteres" };
  }

  if (precio <= 0 || m2 <= 0) {
    return { error: "El precio y los metros cuadrados deben ser mayores a 0" };
  }

  if (!imagenes || imagenes.length === 0) {
    return {
      error: "Debe adjuntar al menos una imagen para publicar la propiedad",
    };
  }

  return null;
}
