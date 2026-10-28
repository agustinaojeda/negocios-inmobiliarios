import { useState, useEffect } from "react";
import { obtenerInmueblesAsignadosPorUsuario } from "../../inmuebles/services/inmueblesService";
import { obtenerSesion } from "../../auth/services/authService";

export function useInmueblesAsignados() {
  const [propiedades, setPropiedades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarInmueblesYUsuario() {
      try {
        setCargando(true);
        setError(null);

        const sesionUsuario = obtenerSesion();
        setUsuario(sesionUsuario);

        if (!sesionUsuario) {
          setError("Debés iniciar sesión para ver tus inmuebles asignados.");
          return;
        }

        const data = await obtenerInmueblesAsignadosPorUsuario(sesionUsuario);
        setPropiedades(data);
      } catch (err) {
        console.error("Error al cargar inmuebles asignados:", err);
        setError("Ocurrió un error al cargar tus inmuebles asignados.");
      } finally {
        setCargando(false);
      }
    }

    cargarInmueblesYUsuario();
  }, []);

  return { propiedades, usuario, cargando, error };
}