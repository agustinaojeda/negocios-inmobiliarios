//recibe datos, los manda al service y devuelve una rta http
import * as service from './favoritos.service.js';

export const obtenerFavoritos = async (req, res, next) => {
  try {
    const usuario = req.usuario; 
    const resultado = await service.obtenerFavoritos(usuario);

    if (resultado.forbidden) {
      return res.status(403).json({ 
        error: 'Solo los inquilinos pueden gestionar la lista de favoritos' 
      });
    }

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

export const agregarFavorito = async (req, res, next) => {
  try {
    const usuario = req.usuario;
    const { id } = req.params; 

    const resultado = await service.agregarFavorito(usuario, id);

    if (resultado.forbidden) {
      return res.status(403).json({ 
        error: 'Solo los inquilinos pueden gestionar la lista de favoritos' 
      });
    }

    if (resultado.noEncontrada) {
      return res.status(404).json({ 
        error: 'El inmueble especificado no existe' 
      });
    }

    if (resultado.yaExiste) {
      return res.status(409).json({ 
        mensaje: 'El inmueble ya se encuentra en tus favoritos' 
      });
    }

    return res.status(201).json({
      mensaje: 'Inmueble agregado a favoritos correctamente',
      favorito: resultado.nuevoFavorito
    });
  } catch (err) {
    next(err);
  }
};

export const eliminarFavorito = async (req, res, next) => {
  try {
    const usuario = req.usuario;
    const { id } = req.params;

    const resultado = await service.eliminarFavorito(usuario, id);

    if (resultado.forbidden) {
      return res.status(403).json({ 
        error: 'Solo los inquilinos pueden gestionar la lista de favoritos' 
      });
    }

    if (resultado.noEncontrado) {
      return res.status(404).json({ 
        error: 'El inmueble no se encuentra en tu lista de favoritos' 
      });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};