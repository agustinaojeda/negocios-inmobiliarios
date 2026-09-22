//busca las propiedades a la bd o json en este caso, es el unico que puede hacer fetch
const URL_BASE = '/backend/data/propiedades'

export async function obtenerPropiedades() { //devuelve todas
  const respuesta = await fetch(`${URL_BASE}/propiedades.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las propiedades')
  }
  return respuesta.json()
}

export async function obtenerPropiedadesDisponibles(){ //devuelve solo las disponibles
  const respuesta = await fetch(`${URL_BASE}/propiedades.json`)
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las propiedades')
  }
  const propiedades = await respuesta.json()
  return propiedades.filter((p) => p.estado === 'disponible')
}

export async function obtenerPropiedadPorId(id) {
  const propiedades = await obtenerPropiedades()
  const propiedad = propiedades.find((p) => p.id === Number(id))
  if (!propiedad) {
    throw new Error('La propiedad que buscás no existe')
  }
  return propiedad
}

export async function obtenerUltimas(limite = 3){ //devuelve las ultimas tres cargadas y disponibles
    const propiedades = await obtenerPropiedadesDisponibles();
    return propiedades.slice(-limite).reverse();
}
