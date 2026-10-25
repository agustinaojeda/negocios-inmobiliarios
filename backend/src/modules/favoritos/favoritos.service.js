//valida datos y llama al repo
import * as repository from './favoritos.repository.js';
import * as inmueblesRepository from '../inmuebles/inmuebles.repository.js';

export const obtenerFavoritos = async (usuario) => {
  const esInquilino = usuario.rol === 'inquilino' ;
  
  if (!esInquilino) {
    return { forbidden: true };
  }

  const favoritos = await repository.obtenerPorUsuario(usuario.id);

  return {favoritos};
};

export const agregarFavorito = async (usuario, propiedadId) => {

  const esInquilino = usuario.rol === 'inquilino';
  if (!esInquilino) {
    return { forbidden: true };
  }

  const propiedad = await inmueblesRepository.obtener(propiedadId);
  if (!propiedad) {
    return { noEncontrada: true };
  } //si la prop esta inactiva no se puede agregar a fav

  const yaExiste = await repository.existeFavorito(usuario.id, propiedadId);
  if (yaExiste) {
    return { yaExiste: true };
  }

  const nuevoFavorito = await repository.agregar(usuario.id, propiedadId);
  return { nuevoFavorito };
};

export const eliminarFavorito = async (usuario, propiedadId) => {
  const esInquilino = usuario.rol === 'inquilino';
  if (!esInquilino) {
    return { forbidden: true };
  }

  const eliminado = await repository.eliminar(usuario.id, propiedadId);
  if (!eliminado) {
    return { noEncontrado: true };
  }

  return { eliminado };
};
