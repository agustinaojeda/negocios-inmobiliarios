import { useState, useEffect } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import {
  obtenerPropiedadesAgente,
  guardarPropiedadAgente,
  eliminarPropiedadAgente,
  activarPropiedadAgente,
} from "../services/agenteService";
import { useToast } from "../../../shared/hooks/useToast";

export function useCarteraInmuebles(agenteId) {
  const {
    datos: iniciales = [],
    cargando,
    error,
  } = useFetch(obtenerPropiedadesAgente);

  const [propiedades, setPropiedades] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [propiedadAEditar, setPropiedadAEditar] = useState(null);
  const { mensaje: notificacion, mostrarToast: setNotificacion } = useToast();

  useEffect(() => {
    if (iniciales) setPropiedades(iniciales);
  }, [iniciales]);

  const propiedadesFiltradas =
    filtroEstado === "todas" || filtroEstado === "todos"
      ? propiedades
      : propiedades.filter((p) => {
          const visibilidad = p.estado_visibilidad || p.estado;
          return String(visibilidad) === String(filtroEstado);
        });

  const guardarPropiedad = async (formData) => {
    try {
      const guardada = await guardarPropiedadAgente(formData);

      const actualizadas = await obtenerPropiedadesAgente(agenteId);
      setPropiedades(actualizadas);

      setNotificacion(
        formData.get("id")
          ? "Inmueble actualizado correctamente"
          : "Inmueble publicado correctamente",
      );
      setModalAbierto(false);
      return guardada;
    } catch (err) {
      console.error(err);
      setNotificacion("Error al guardar inmueble");
      throw err;
    }
  };

  const alternarEstadoPropiedad = async (id, titulo, estadoActual) => {
    const esActivo = estadoActual === "activo";
    const accionTexto = esActivo ? "dar de baja" : "dar de alta";

    if (
      !window.confirm(
        `¿Seguro que querés ${accionTexto} el inmueble "${titulo}"?`,
      )
    ) {
      return;
    }

    try {
      if (esActivo) {
        await eliminarPropiedadAgente(id); 
      } else {
        await activarPropiedadAgente(id); 
      }

      const nuevoEstado = esActivo ? "inactivo" : "activo";

      setPropiedades((prev) =>
        prev.map((p) =>
          String(p.id) === String(id)
            ? { ...p, estado_visibilidad: nuevoEstado, estado: nuevoEstado }
            : p,
        ),
      );

      setNotificacion(
        `Inmueble "${titulo}" ${esActivo ? "dado de baja" : "activado"}`,
      );
    } catch (err) {
      console.error(err);
      setNotificacion(`Error al ${accionTexto} el inmueble`);
    }
  };

  const abrirCrear = () => {
    setPropiedadAEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (propiedad) => {
    setPropiedadAEditar(propiedad);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return {
    propiedadesFiltradas,
    cargando,
    error,
    filtroEstado,
    setFiltroEstado,
    notificacion,
    modalAbierto,
    propiedadAEditar,
    guardarPropiedad,
    alternarEstadoPropiedad,
    abrirCrear,
    abrirEditar,
    cerrarModal,
  };
}
