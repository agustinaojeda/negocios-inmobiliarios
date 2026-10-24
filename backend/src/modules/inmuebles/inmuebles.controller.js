//recibe los datos de la peticion, los manda al service y devuelve respuesta hhtp
import * as service from "./inmuebles.service.js";

export const listar = async (req, res, next) => {
  try {//prop activas
    const filtros = req.query;
    const propiedades = await service.listar(filtros, false);
    return res.status(200).json(propiedades);
  } catch (err) {
    next(err);
  }
};

export const listarPanel = async (req, res, next) => {
  try {//prop activas e inactivas
    const filtros = req.query;
    const propiedades = await service.listar(filtros, true);
    return res.status(200).json(propiedades);
  } catch (err) {
    next(err);
  }
};

export const obtener = async (req, res, next) => {
  try {//detalle prop act
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
  try {//detalle prop act o inac
    const { id } = req.params;
    const propiedad = await service.obtener(id, true);

    if (!propiedad || propiedad == null) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    if (propiedad.agente_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tenés permisos para ver esta propiedad' });
    }

    return res.status(200).json(propiedad);
  } catch (err) {
    next(err);
  }
};

export const crear = async (req, res, next) => {
  try {
    const agenteId = req.usuario.id;

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
      imagenes,
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
      imagenes
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
      imagenes
    };

    const resultado = await service.actualizar(id, datosPropiedad, agenteId);

    if (resultado === null) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    if (resultado.forbidden) {//si el id del agente logeado no coincide con el id del agente de la prop
      return res.status(403).json({ error: 'No tenés permisos para modificar esta propiedad'  });
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
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    if (resultado.forbidden) {
      return res.status(403).json({ error: 'No tenés permisos para eliminar esta propiedad' });
    }
    
    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(200).json({
      mensaje: 'Propiedad desactivada correctamente',
      propiedad: resultado
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
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    if (resultado.forbidden) {
      return res.status(403).json({ error: 'No tenés permisos para activar esta propiedad' });
    }

    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }

    return res.status(200).json({
      mensaje: 'Propiedad reactivada correctamente',
      propiedad: resultado
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
      return res.status(404).json({ error: 'Inmueble no encontrado' });
    }

    if (resultado.forbidden) {
      return res.status(403).json({ error: 'No tenés permisos para ver el historial de este inmueble' });
    }

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};