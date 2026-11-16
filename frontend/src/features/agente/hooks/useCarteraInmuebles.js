import { useState, useEffect } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import { listarOperaciones } from "../../../shared/services/operacionesService";
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

  const { datos: operaciones } = useFetch(listarOperaciones);
  const idsConOperacion = new Set(
    (operaciones || []).map((operacion) => Number(operacion.propiedad_id)),
  );

  const [propiedades, setPropiedades] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [propiedadAEditar, setPropiedadAEditar] = useState(null);
  const [confirmacionEstado, setConfirmacionEstado] = useState(null);
  const [procesandoEstado, setProcesandoEstado] = useState(false);
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

  // Abre el diálogo de confirmación; la baja/alta se ejecuta al confirmar
  const alternarEstadoPropiedad = (id, titulo, estadoActual) => {
    setConfirmacionEstado({ id, titulo, estadoActual });
  };

  const cancelarAlternarEstado = () => {
    if (procesandoEstado) return;
    setConfirmacionEstado(null);
  };

  const confirmarAlternarEstado = async () => {
    if (!confirmacionEstado) return;

    const { id, titulo, estadoActual } = confirmacionEstado;
    const esActivo = estadoActual === "activo";
    const accionTexto = esActivo ? "dar de baja" : "dar de alta";

    try {
      setProcesandoEstado(true);

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
    } finally {
      setProcesandoEstado(false);
      setConfirmacionEstado(null);
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
    idsConOperacion,
    confirmacionEstado,
    procesandoEstado,
    guardarPropiedad,
    alternarEstadoPropiedad,
    confirmarAlternarEstado,
    cancelarAlternarEstado,
    abrirCrear,
    abrirEditar,
    cerrarModal,
  };
}
