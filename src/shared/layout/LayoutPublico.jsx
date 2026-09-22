import { Outlet, ScrollRestoration } from "react-router"
import Navbar from './Navbar'
import logoDark from "/logoDark.png";
import logoLight from "/logoLight.png";

export default function LayoutPublico() {
  const enlaces = [
    { id:"nav-inicio", text: "Inicio", url: "/" },
    { id: "nav-nosotros", text: "Nosotros", url: "#about" },
    { id: "nav-alquiler", text: "Alquila tu propiedad", url: "#formAlquiler" },
  ];

  const acciones = [
    {
      id: "nav-cta-tasar",
      text: "Tasar mi propiedad",
      url: "#contacto",
      className: "nav-cta"
    },
    {
      id: "nav-cta-ver",
      text: "Ver propiedades",
      url: "#propiedades",
      className: "btn-nav-primary"
    },
    {
      id: "nav-login",
      text: "",
      url: "/login",
      className: "nav-login-btn",
      icon: true,
      ariaLabel: "Iniciar Sesión",
      title: "Panel de Administración"
    }
  ];

  // Botones del menu movil
   const accionesMobile = [
    { id: "nav-cta-tasar-m", text: "Tasar mi propiedad", url: "#contacto", className: "nav-cta" },
    { id: "nav-cta-ver-m", text: "Ver propiedades", url: "#propiedades", className: "btn-nav-primary" },
    {
      id: "nav-login-m",
      text: "Ingresar",
      url: "/login",
      className: "btn-nav-primary",
      icon: true,
    },
  ];

  return (
    <>
      <Navbar
        marca="Negocios Inmobiliarios"
        logoLight={logoLight}
        logoDark={logoDark}
        enlaces={enlaces}
        acciones={acciones}
        accionesMobile={accionesMobile}
      />
      <main>
        <Outlet />
      </main>

      <ScrollRestoration />
    </>
  )
}