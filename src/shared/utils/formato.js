// Funciones puras: reciben un valor y devuelven otro, sin estado ni marcado.

export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
export function formatearPrecio(valor, moneda = 'USD') { //si es pesos argentinos llamenla formatearPrecio(p.precio, ARS)
  if (valor === undefined || valor === null) return `${moneda} 0`

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    currencyDisplay: 'code', 
    maximumFractionDigits: 0,
  }).format(valor)
}
