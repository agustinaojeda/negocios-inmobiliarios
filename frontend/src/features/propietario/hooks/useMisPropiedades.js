import { useState, useEffect, useMemo } from 'react'
import {
  obtenerMisPropiedadesDetalladas,
  obtenerMisCitasDetalladas
} from '../services/propietarioService'

export function useMisPropiedades(propietarioId = null) {
  const [propiedades, setPropiedades] = useState([])
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [errorCitas, setErrorCitas] = useState(null)

  const [filtroEstadoProp, setFiltroEstadoProp] = useState('todas')
  const [filtroEstadoCita, setFiltroEstadoCita] = useState('todas')

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        setCargando(true)
        setError(null)
        setErrorCitas(null)

        const [propsResultado, citasResultado] = await Promise.allSettled([
          obtenerMisPropiedadesDetalladas(propietarioId),
          obtenerMisCitasDetalladas(propietarioId),
        ])

        if (!activo) return

        if (propsResultado.status === 'fulfilled') {
          setPropiedades(propsResultado.value)
        } else {
          setError(
            propsResultado.reason?.message ||
              'Error al obtener las propiedades del propietario'
          )
        }

        if (citasResultado.status === 'fulfilled') {
          setCitas(citasResultado.value)
        } else {
          setErrorCitas(
            citasResultado.reason?.message ||
              'Error al obtener las citas del propietario'
          )
        }
      } catch (err) {
        if (activo) {
          setError(err.message || 'Error al obtener los datos del propietario')
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }
  }, [propietarioId])

  const propiedadesFiltradas = useMemo(() => {
    if (filtroEstadoProp === 'todas') return propiedades
    return propiedades.filter(
      (p) => p.estado_comercial?.toLowerCase() === filtroEstadoProp.toLowerCase()
    )
  }, [propiedades, filtroEstadoProp])

  const citasFiltradas = useMemo(() => {
    if (filtroEstadoCita === 'todas') return citas
    return citas.filter(
      (c) => c.estado?.toLowerCase() === filtroEstadoCita.toLowerCase()
    )
  }, [citas, filtroEstadoCita])

  return {
    propiedades: propiedadesFiltradas,
    citas: citasFiltradas,
    cargando,
    error,
    errorCitas,
    filtroEstadoProp,
    setFiltroEstadoProp,
    filtroEstadoCita,
    setFiltroEstadoCita,
  }
}