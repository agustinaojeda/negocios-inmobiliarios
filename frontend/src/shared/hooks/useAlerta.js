import { useCallback, useEffect, useState } from 'react'

// Estado de una alerta que se oculta sola después de unos segundos
export function useAlerta(duracionMs = 5000) {
  const [alerta, setAlerta] = useState(null)

  useEffect(() => {
    if (!alerta) return
    const timer = setTimeout(() => setAlerta(null), duracionMs)
    return () => clearTimeout(timer)
  }, [alerta, duracionMs])

  const mostrarExito = useCallback((mensaje) => setAlerta({ tipo: 'success', mensaje }), [])
  const mostrarError = useCallback((mensaje) => setAlerta({ tipo: 'danger', mensaje }), [])
  const cerrar = useCallback(() => setAlerta(null), [])

  return { alerta, mostrarExito, mostrarError, cerrar }
}
