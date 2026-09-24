import { useState, useEffect } from "react";
import { obtenerMetricasPropietario } from "../services/propietarioService";

export function useMetricasPropietario() {
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarMetricas() {
      try {
        setCargando(true);
        setError(null);
        const datos = await obtenerMetricasPropietario();
        
        if (!cancelado) {
          setMetricas(datos);
        }
      } catch (err) {
        if (!cancelado) {
          console.error("Error al obtener métricas:", err.message);
          setError("No se pudieron cargar las métricas de tus propiedades.");
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarMetricas();

    return () => {
      cancelado = true;
    };
  }, []);

  return { metricas, cargando, error };
}