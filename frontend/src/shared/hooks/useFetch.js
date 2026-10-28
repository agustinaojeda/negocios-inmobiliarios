import { useEffect, useState } from 'react'

// Clase 3
// Pedir datos es sincronizarse con un sistema externo (el servidor), por eso
// va en un useEffect. El hook recibe una función de un service y, opcionalmente,
// un parámetro:  useFetch(obtenerProductos)  ·  useFetch(obtenerProductoPorId, id)
export function useFetch(servicio, parametro) {
  const [respuesta, setRespuesta] = useState({
    servicio: null,
    parametro: undefined,
    datos: null,
    error: null,
  })

  useEffect(() => {
    // Limpieza: si el componente se desmonta o cambia el parámetro antes de
    // que llegue la respuesta, la ignoramos (evita mostrar datos viejos).
    // En desarrollo, StrictMode ejecuta el efecto dos veces: por eso vas a ver
    // dos pedidos en la pestaña Network. Es esperado.
    let ignorar = false

    servicio(parametro)
      .then((datos) => {
        if (!ignorar) setRespuesta({ servicio, parametro, datos, error: null })
      })
      .catch((error) => {
        if (!ignorar) setRespuesta({ servicio, parametro, datos: null, error })
      })

    return () => {
      ignorar = true
    }
  }, [servicio, parametro])

  // CLASE 3 
  // Estado derivado: "cargando" no se guarda en otro useState,
  // se calcula: si la última respuesta no corresponde al pedido actual, está cargando.
  const cargando = respuesta.servicio !== servicio || respuesta.parametro !== parametro

  return {
    datos: cargando ? null : respuesta.datos,
    error: cargando ? null : respuesta.error,
    cargando,
  }
}
