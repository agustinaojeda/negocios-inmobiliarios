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

  const [filtroEstadoProp, setFiltroEstadoProp] = useState('todas')
  const [filtroEstadoCita, setFiltroEstadoCita] = useState('todas')

  useEffect(() => {
    let activo = true

    async function cargarDatos() {
      try {
        setCargando(true)
        setError(null)

        const [propsData, citasData] = await Promise.all([
          obtenerMisPropiedadesDetalladas(propietarioId),
          obtenerMisCitasDetalladas(propietarioId)
        ])

        if (activo) {
          setPropiedades(propsData)
          setCitas(citasData)
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
      (p) => p.estado?.toLowerCase() === filtroEstadoProp.toLowerCase()
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
    filtroEstadoProp,
    setFiltroEstadoProp,
    filtroEstadoCita,
    setFiltroEstadoCita,
  }
}