<<<<<<< Updated upstream
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from 'react-router'
import { router } from './router'

export default function App() {
  return <RouterProvider router={router} />
}
=======
import logoLight from "/logoLight.png";
import logoDark from "/logoDark.png";
import "./App.css";
import NavBar from "./shared/layout/Navbar";

export default function MyApp() {
  const enlaces = [
    { id: "nav-comprar", text: "Comprar", url: "#propiedades" },
    { id: "nav-alquilar", text: "Alquilar", url: "#propiedades" },
    { id: "nav-nosotros", text: "Nosotros", url: "pages/nosotros.html" },
    { id: "nav-contacto", text: "Contacto", url: "#contacto" },
    { id: "nav-calculadora", text: "Calculadora", url: "#calculadora" },
  ];

  // Botones del navbar de escritorio (.nav-actions)
  const acciones = [
    { id: "nav-cta-tasar", text: "Tasar mi propiedad", url: "#contacto", className: "nav-cta" },
    { id: "nav-cta-ver", text: "Ver propiedades", url: "#propiedades", className: "btn-nav-primary" },
    {
      text: "",
      url: "pages/admin/panelAdmin.html",
      className: "nav-login-btn",
      icon: true,
      ariaLabel: "Iniciar Sesión",
      title: "Panel de Administración",
    },
  ];

  // Botones del menú móvil (mobile-nav-actions): en el sitio original
  // tienen estilos inline propios y un botón extra ("Propietario").
  const accionesMobile = [
    {
      text: "Tasar mi propiedad",
      url: "#contacto",
      className: "nav-cta",
      style: { borderColor: "var(--navy-800)", color: "var(--navy-800)", textAlign: "center" },
    },
    {
      text: "Ver propiedades",
      url: "#propiedades",
      className: "btn-nav-primary",
      style: { textAlign: "center" },
    },
    {
      text: "Ingresar",
      url: "pages/admin/panelAdmin.html",
      className: "btn-nav-primary",
      icon: true,
      style: {
        background: "var(--navy-900)",
        color: "var(--white)",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      },
    },
    {
      text: "Propietario",
      url: "pages/propietario/panelPropietario.html",
      className: "btn-nav-primary",
      style: {
        background: "var(--navy-800)",
        color: "var(--white)",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      },
    },
  ];

  return (
    <div>
      <NavBar
        marca="Negocios Inmobiliarios"
        logoLight={logoLight}
        logoDark={logoDark}
        enlaces={enlaces}
        acciones={acciones}
        accionesMobile={accionesMobile}
      />
    </div>
  );
}
>>>>>>> Stashed changes
