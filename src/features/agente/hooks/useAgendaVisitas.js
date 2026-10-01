import { useState, useEffect } from 'react'
import { useFetch } from '../../../shared/hooks/useFetch'
import { obtenerCitasAgente, actualizarEstadoCita } from '../services/agenteService'

export function useAgendaVisitas(agenteId) {
  const { datos: iniciales = [], cargando, error } = useFetch(obtenerCitasAgente, agenteId)

  const [citas, setCitas] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [notificacion, setNotificacion] = useState('')

  useEffect(() => {
    if (iniciales) setCitas(iniciales)
  }, [iniciales])

  useEffect(() => {
    if (!notificacion) return
    const timer = setTimeout(() => setNotificacion(''), 3500)
    return () => clearTimeout(timer)
  }, [notificacion])

  const citasFiltradas =
    filtro === 'todas' ? citas : citas.filter((c) => c.estado === filtro)

  const pendientesCont = citas.filter((c) => c.estado === 'pendiente').length

  const cambiarEstado = async (citaId, nuevoEstado, mensaje) => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado)
      setCitas((prev) =>
        prev.map((c) => (String(c.id) === String(citaId) ? { ...c, estado: nuevoEstado } : c))
      )
      setNotificacion(mensaje || `Visita actualizada a ${nuevoEstado}`)
    } catch {
      setNotificacion('Error al actualizar la visita')
    }
  }

  return {
    citasFiltradas,
    cargando,
    error,
    filtro,
    setFiltro,
    notificacion,
    pendientesCont,
    cambiarEstado,
  }
}
