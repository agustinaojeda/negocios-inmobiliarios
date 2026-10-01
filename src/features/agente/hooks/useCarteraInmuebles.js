import { useState, useEffect } from 'react'
import { useFetch } from '../../../shared/hooks/useFetch'
import {
    obtenerPropiedadesAgente,
    guardarPropiedadAgente,
    cambiarEstadoPropiedad,
    eliminarPropiedadAgente,
} from '../services/agenteService'

export function useCarteraInmuebles(agenteId) {
    const { datos: iniciales = [], cargando, error } = useFetch(
        obtenerPropiedadesAgente,
        agenteId
    )

    const [propiedades, setPropiedades] = useState([])
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [propiedadAEditar, setPropiedadAEditar] = useState(null)
    const [notificacion, setNotificacion] = useState('')

    // Sincronizar datos cuando useFetch responde
    useEffect(() => {
        if (iniciales) setPropiedades(iniciales)
    }, [iniciales])

    // Temporizador para limpiar notificaciones
    useEffect(() => {
        if (!notificacion) return
        const timer = setTimeout(() => setNotificacion(''), 3500)
        return () => clearTimeout(timer)
    }, [notificacion])

    // Lista derivada según filtro
    const propiedadesFiltradas =
        filtroEstado === 'todos'
            ? propiedades
            : propiedades.filter((p) => p.estado === filtroEstado)

    // Acciones de negocio
    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await cambiarEstadoPropiedad(id, nuevoEstado)
            setPropiedades((prev) =>
                prev.map((p) => (String(p.id) === String(id) ? { ...p, estado: nuevoEstado } : p))
            )
            setNotificacion(`Estado cambiado a "${nuevoEstado.toUpperCase()}"`)
        } catch {
            setNotificacion('Error al actualizar estado')
        }
    }

    const guardarPropiedad = async (formData) => {
        try {
            const guardada = await guardarPropiedadAgente(formData, agenteId)
            const actualizadas = await obtenerPropiedadesAgente(agenteId)
            setPropiedades(actualizadas)
            setNotificacion(formData.id ? 'Inmueble actualizado' : 'Inmueble publicado')
            setModalAbierto(false)
            return guardada
        } catch {
            setNotificacion('Error al guardar inmueble')
        }
    }

    const eliminarPropiedad = async (id, titulo) => {
        if (!window.confirm(`¿Dar de baja "${titulo}"?`)) return
        try {
            await eliminarPropiedadAgente(id)
            setPropiedades((prev) => prev.filter((p) => String(p.id) !== String(id)))
            setNotificacion('Inmueble eliminado de tu cartera')
        } catch {
            setNotificacion('Error al eliminar inmueble')
        }
    }

    const abrirCrear = () => {
        setPropiedadAEditar(null)
        setModalAbierto(true)
    }

    const abrirEditar = (propiedad) => {
        setPropiedadAEditar(propiedad)
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        setModalAbierto(false)
    }

    return {
        propiedadesFiltradas,
        cargando,
        error,
        filtroEstado,
        setFiltroEstado,
        notificacion,
        modalAbierto,
        propiedadAEditar,
        cambiarEstado,
        guardarPropiedad,
        eliminarPropiedad,
        abrirCrear,
        abrirEditar,
        cerrarModal,
    }
}