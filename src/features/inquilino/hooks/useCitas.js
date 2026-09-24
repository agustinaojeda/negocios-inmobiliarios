import { useState, useEffect } from "react";
import { citasService } from "../services/citasService";
import { obtenerSesion } from "../../auth/services/authService";

export function useMisCitas() {
  const [citas, setCitas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarCitasYUsuario() {
      try {
        setCargando(true);
        setError(null);

        const sesionUsuario = obtenerSesion();
        setUsuario(sesionUsuario);

        if (!sesionUsuario) {
          setError("Debés iniciar sesión para ver tus citas agendadas.");
          return;
        }

        const data = await citasService.getCitasPorUsuario(sesionUsuario);
        setCitas(data);
      } catch (err) {
        setError("Ocurrió un error al cargar tus citas agendadas.");
      } finally {
        setCargando(false);
      }
    }

    cargarCitasYUsuario();
  }, []);

  const citasFiltradas = citas.filter((cita) => {
    if (estadoFiltro === "todas") return true;
    return cita.estado?.toLowerCase() === estadoFiltro.toLowerCase();
  });

  return {
    citas: citasFiltradas,
    usuario,
    estadoFiltro,
    setEstadoFiltro,
    cargando,
    error,
  };
}