import { Outlet, ScrollRestoration } from "react-router"
import Navbar from './Navbar'
import logoDark from "/logoDark.png";

export default function LayoutPublico() {
  const enlaces = [
    { text: "Inicio", url: "/" },
    { text: "Nosotros", url: "#about" },
    { text: "Alquila tu propiedad", url: "#formAlquiler" },
  ];

  const acciones = [
    {
      text: "Tasar mi propiedad",
      url: "#contacto",
      className: "btn btn-outline-dark"
    },
    {
      text: "Ver propiedades",
      url: "#propiedades",
      className: "btn btn-warning"
    },
    {
      text: "",
      url: "/login",
      className: "btn btn-secondary px-3",
      icon: true,
      ariaLabel: "Iniciar Sesión",
      title: "Panel de Administración"
    }
  ];

  return (
    <>
      <Navbar
        marca="Negocios Inmobiliarios"
        logo={logoDark}
        enlaces={enlaces}
        acciones={acciones}
      />
      <main>
        <Outlet />
      </main>

      <ScrollRestoration />
    </>
  )
}