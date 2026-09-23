import { obtenerSesion } from '../../auth/services/authService';

const getStorageKey = () => { //usa el mail del usuario como clave
  const sesion = obtenerSesion();
  return sesion?.email ? `favoritos_${sesion.email}` : null;
};

//obtiene la lista de ids favoritos del usuario actual
export function obtenerFavoritos() {
  const key = getStorageKey();
  if (!key) return [];
  
  const favs = localStorage.getItem(key);
  return favs ? JSON.parse(favs) : [];
}

//verifica si una propiedad especifica es favorita
export function esFavorito(propertyId) {
  const favs = obtenerFavoritos();
  return favs.includes(propertyId);
}

//agrega o saca una propiedad de favoritos y devuelve el nuevo estado
export function toggleFavorito(propertyId) {
  const key = getStorageKey();
  if (!key) return false;

  let favs = obtenerFavoritos();
  const index = favs.indexOf(propertyId);

  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    favs.push(propertyId);
  }

  //a las propiedades fav las guarda en el localstorage
  localStorage.setItem(key, JSON.stringify(favs));

  window.dispatchEvent(new Event('favoritosUpdated'));

  return favs.includes(propertyId);
}