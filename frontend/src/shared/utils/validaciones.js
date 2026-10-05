// Validaciones genéricas: no saben nada de contacto ni de login.
// Cada formulario arma su propia función validar() combinándolas.

export function esRequerido(valor) {
    return String(valor ?? '').trim() !== ''
}

export function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function esTelefonoValido(telefono) {
    return /^\+?[\d\s\-]{8,15}$/.test(telefono.trim())
}