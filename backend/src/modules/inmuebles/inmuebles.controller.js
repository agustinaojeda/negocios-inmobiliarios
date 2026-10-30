//recibe los datos de la peticion, los manda al service y devuelve respuesta hhtp
import * as service from "./inmuebles.service.js";

export const listar = async (req, res, next) => {
  try {
    //prop activas
    const filtros = req.query;
    const propiedades = await service.listar(filtros, false);
    return res.status(200).json(propiedades);
  } catch (err) {
    next(err);
  }
};

export const listarPanel = async (req, res, next) => {
  try {
    const filtros = req.query;
    const { rol, id } = req.usuario;

    let propiedades = [];

    if (rol === "agente") {
      propiedades = await service.listar(filtros, true, id, null);
    } else if (rol === "admin") {
      propiedades = await service.listar(filtros, true, null, null);
    } else if (rol === "propietario") {
      propiedades = await service.listar(filtros, true, null, id);
    } else {
      return res.status(403).json({ error: "Acceso no autorizado al panel" });
    }

    return res.status(200).json(propiedades);
  } catch (err) {
    next(err);
  }
};

export const obtener = async (req, res, next) => {
  try {
    //detalle prop act
    const { id } = req.params;
    const propiedad = await service.obtener(id, false);
    if (!propiedad || propiedad == null) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }
    return res.status(200).json(propiedad);
  } catch (err) {
    next(err);
  }
};

export const obtenerPanel = async (req, res, next) => {
  try {
    //detalle prop act o inac
    const { id } = req.params;
    const propiedad = await service.obtener(id, true);

    if (!propiedad || propiedad == null) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    if ((req.usuario.rol === 'agente' && propiedad.agente_id !== req.usuario.id) || (req.usuario.rol !== 'admin' && req.usuario.rol !== 'agente')) {
      return res
        .status(403)
        .json({ error: "No tenés permisos para ver esta propiedad" });
    }

    return res.status(200).json(propiedad);
  } catch (err) {
    next(err);
  }
};

export const crear = async (req, res, next) => {
  try {
    const agenteId = req.usuario.id;

    //procesar fotos subidas
    let imagenes = [];
    if (req.files && req.files.length > 0) {
      imagenes = req.files.map((file, index) => ({
        //si subio varias
        url: `/img/propiedades/${file.filename}`,
        es_principal: index === 0,
        orden: index + 1,
      }));
    } else if (req.file) {
      //si subio solo una
      imagenes = [
        {
          url: `/img/propiedades/${req.file.filename}`,
          es_principal: true,
          orden: 1,
        },
      ];
    }

    const {
      propietario_id,
      titulo,
      descripcion,
      categoria,
      moneda,
      precio,
      expensas,
      direccion,
      zona,
      ambientes,
      banos,
      m2,
      estado_comercial,
      estado_visibilidad,
    } = req.body;

    const datosPropiedad = {
      propietario_id,
      titulo,
      descripcion,
      categoria,
      moneda,
      precio,
      expensas,
      direccion,
      zona,
      ambientes,
      banos,
      m2,
      estado_comercial,
      estado_visibilidad,
      imagenes,
    };

    const resultado = await service.crear(datosPropiedad, agenteId);

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agenteId = req.usuario.id;

    let imagenesProcesadas = [];
    if (req.files && req.files.length > 0) {
      imagenesProcesadas = req.files.map((file, index) => ({
        url: `/img/propiedades/${file.filename}`,
        es_principal: index === 0,
        orden: index + 1,
      }));
    } else if (req.body.imagenes) {
      imagenesProcesadas =
        typeof req.body.imagenes === "string"
          ? JSON.parse(req.body.imagenes)
          : req.body.imagenes;
    }

    const {
      propietario_id,
      titulo,
      descripcion,
      categoria,
      moneda,
      precio,
      expensas,
      direccion,
      zona,
      ambientes,
      banos,
      m2,
      estado_comercial,
      estado_visibilidad,
    } = req.body;

    const datosPropiedad = {
      propietario_id,
      titulo,
      descripcion,
      categoria,
      moneda,
      precio,
      expensas,
      direccion,
      zona,
      ambientes,
      banos,
      m2,
      estado_comercial,
      estado_visibilidad,
      ...(imagenesProcesadas.length > 0 && { imagenes: imagenesProcesadas }),
    };

    const resultado = await service.actualizar(id, datosPropiedad, agenteId);

    if (resultado === null) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    if (resultado.forbidden) {
      //si el id del agente logeado no coincide con el id del agente de la prop
      return res
        .status(403)
        .json({ error: "No tenés permisos para modificar esta propiedad" });
    }

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agenteId = req.usuario.id;

    const resultado = await service.eliminar(id, agenteId);

    if (resultado === null) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    if (resultado.forbidden) {
      return res
        .status(403)
        .json({ error: "No tenés permisos para eliminar esta propiedad" });
    }

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(200).json({
      mensaje: "Propiedad desactivada correctamente",
      propiedad: resultado,
    });
  } catch (err) {
    next(err);
  }
};

export const activar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const agenteId = req.usuario.id;

    const resultado = await service.activar(id, agenteId);

    if (resultado === null) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    if (resultado.forbidden) {
      return res
        .status(403)
        .json({ error: "No tenés permisos para activar esta propiedad" });
    }

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(200).json({
      mensaje: "Propiedad reactivada correctamente",
      propiedad: resultado,
    });
  } catch (err) {
    next(err);
  }
};

//historial
export const obtenerHistorial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = req.usuario;

    const resultado = await service.obtenerHistorialPrecios(id, usuario);

    if (resultado === null) {
      return res.status(404).json({ error: "Inmueble no encontrado" });
    }

    if (resultado.forbidden) {
      return res
        .status(403)
        .json({
          error: "No tenés permisos para ver el historial de este inmueble",
        });
    }

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

//imagen
export const eliminarImagen = async (req, res, next) => {
  try {
    const { id } = req.params;

    await service.eliminarImagen(id);

    return res.status(200).json({ mensaje: "Imagen eliminada correctamente" });
  } catch (err) {
    next(err);
  }
};
