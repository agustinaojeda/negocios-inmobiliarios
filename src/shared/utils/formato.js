// Funciones puras: reciben un valor y devuelven otro, sin estado ni marcado.

export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}