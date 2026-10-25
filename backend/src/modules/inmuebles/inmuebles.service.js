//valida los datos y si necesita algo de info lo llama al repository
import { error } from "console";
import { errorHandler } from "../../shared/middlewares/errorHandler.js";
import * as repository from "./inmuebles.repository.js";
import fs from "fs/promises";
import path from "path";

export const listar = async (filtros, esAgente = false, agenteId = null) => {
  const propiedades = await repository.listar(filtros, esAgente, agenteId);

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
  const errorImg = validarImg(datos);
  if (errorValidacion || errorImg) {
    return errorValidacion || errorImg;
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

  if (imagenes && imagenes.length > 0) {
    const imagenesExistentes = await repository.obtenerImagenes(id);
    const totalImagenes = imagenesExistentes.length + imagenes.length;

    if (totalImagenes > 10) {
      return {error : `El inmueble no puede tener más de 10 imágenes (actuales: ${imagenesExistentes.length}, intentás agregar: ${imagenes.length})` };
    }
    const ultimoOrden = imagenesExistentes.length;

    const imagenesNuevasConOrden = imagenes.map((img, idx) => {
      const url = typeof img === "string" ? img : img.url;
      return {
        url,
        orden: ultimoOrden + idx + 1,
        es_principal: ultimoOrden === 0 && idx === 0,
      };
    });

    await repository.guardarImagenes(id, imagenesNuevasConOrden);
  }

  const imagenesTotales = await repository.obtenerImagenes(id);

  return {
    ...propiedadActualizada,
    imagenes: imagenesTotales,
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

//imagenes
export const eliminarImagen = async (imagenId) => {
  const imagen = await repository.obtenerImagenPorId(imagenId);

  if (!imagen) {
    const error = new Error("Imagen no encontrada");
    error.status = 404;
    throw error;
  }

  //se elimina de la bd
  await repository.eliminarImagen(imagenId);

  //y de la carpeta
  if (imagen.url) {
    const rutaFisica = path.join(process.cwd(), "public", imagen.url);
    await fs.unlink(rutaFisica).catch(() => {});
  }

  return true;
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

  return null;
}
function validarImg(datos) {
  const { imagenes } = datos;
  if (!imagenes || imagenes.length === 0) {
    return {
      error: "Debe adjuntar al menos una imagen para publicar la propiedad",
    };
  } else if(imagenes.length >= 10){
    return {
      error: "El maximo permitido son 10 imágenes."
    }
  }
  return null;
}
