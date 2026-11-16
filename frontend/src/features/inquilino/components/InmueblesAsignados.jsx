import SeccionPropiedades from "../../../shared/components/propiedades/SeccionPropiedades";
import CardInmuebleAsignado from "./CardInmuebleAsignado";
import { useInmueblesAsignados } from "../hooks/useInmueblesAsignados";

export default function InmueblesAsignados() {
  const { propiedades, usuario, cargando, error } = useInmueblesAsignados();

  return (
    <SeccionPropiedades
      titulo="Mis Inmuebles Asignados"
      subtitulo={
        usuario
          ? `Propiedades con contrato activo para ${usuario.nombre}`
          : "Gestioná los inmuebles asignados a tu cuenta"
      }
      propiedades={propiedades}
      cargando={cargando}
      error={error}
      textoCargando="Cargando tus inmuebles asignados..."
      renderCard={(inmueble) => <CardInmuebleAsignado inmueble={inmueble} />}
      vacio={{
        titulo: "No tenés inmuebles asignados",
        texto: "Aún no poseés contratos activos registrados a tu nombre.",
        linkTo: "/inmuebles",
        linkTexto: "Explorar catálogo",
      }}
    />
  );
}