import React, { useState, useEffect } from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import { obtenerInmueblesAsignadosPorUsuario } from "../../inmuebles/services/inmueblesService";
import { obtenerSesion } from "../../auth/services/authService";

export default function InmueblesAsignados() {
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

  return (
    <SeccionPropiedades
      titulo="Mis Inmuebles Asignados"
      subtitulo={
        usuario
          ? `Propiedades con contrato activo para ${usuario.nombre}`
          : "Gestioná los inmuebles asignados a tu cuenta"
      }
      propiedades={propiedades}
      esAsignado={true}
      cargando={cargando}
      error={error}
      textoCargando="Cargando tus inmuebles asignados..."
      vacio={{
        titulo: "No tenés inmuebles asignados",
        texto: "Aún no poseés contratos activos registrados a tu nombre.",
        linkTo: "/inmuebles",
        linkTexto: "Explorar catálogo",
      }}
    />
  );
}