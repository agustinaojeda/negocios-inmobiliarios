import React, { useState, useEffect } from "react";
import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import FiltroPills from "../../inmuebles/components/FiltroPills";
import { citasService } from "../services/citasService";
import { obtenerSesion } from "../../auth/services/authService"; 
import "./filtro-compacto.css";

export default function Citas() {
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

  return (
    <SeccionPropiedades
      titulo="Mis Citas Agendadas"
      subtitulo={usuario ? `Viendo citas de ${usuario.nombre}` : "Gestioná tus visitas a inmuebles"}
      citas={citasFiltradas}
      cargando={cargando}
      error={error}
      textoCargando="Cargando tus citas..."
      vacio={{
        titulo:
          estadoFiltro === "todas"
            ? "No tenés citas agendadas"
            : `No tenés citas en estado "${estadoFiltro}"`,
        texto: "Explorá las propiedades disponibles y coordiná una visita.",
        linkTo: "/inmuebles",
        linkTexto: "Ver propiedades disponibles",
      }}
    >
      <div className="filtro-compacto mb-4">
        <FiltroPills
          titulo="Filtrar por estado:"
          opciones={["todas", "pendiente", "confirmada", "completada", "cancelada"]}
          seleccionado={estadoFiltro}
          onSeleccionar={setEstadoFiltro}
        />
      </div>
    </SeccionPropiedades>
  );
}