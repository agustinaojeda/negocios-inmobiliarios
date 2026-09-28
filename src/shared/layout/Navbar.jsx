import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import UserIcon from "../components/icons/UserIcon";
import { obtenerSesion } from "../../features/auth/services/authService"
import "./Navbar.css";

/**
 * Navbar fiel al diseño original (navy/dorado):
 * - Fondo transparente sobre el hero, se vuelve blanco/blur al hacer scroll ("scrolled").
 * - Logo claro/oscuro que cambia según el fondo de la barra.
 * - Menú hamburguesa con navegación móvil deslizable.
 * - Resalta el link de la sección visible (scrollspy) cuando existen <section id="...">.
 *
 * Props:
 * - marca: string
 * - logoLight / logoDark: rutas de imagen
 * - enlaces: [{ id, text, url }]              -> links del menú (desktop y mobile)
 * - acciones: [{ id, text, url, className, icon, ariaLabel, title }]        -> botones desktop (.nav-actions)
 * - accionesMobile: mismo shape que "acciones", opcional -> botones dentro de mobile-nav.
 *     Si no se pasa, se reutiliza "acciones".
 */
export default function Navbar({
  marca,
  logoLight,
  logoDark,
  enlaces = [],
  acciones = [],
  accionesMobile,
}) {
  
  const location = useLocation();
  const esHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(null);

  //estado que lee la sesion activa
  const [usuario, setUsuario] = useState(() => obtenerSesion());

  useEffect(() => {
    //escucha si la sesión cambia o se actualiza
    const manejarCambioSesion = () => setUsuario(obtenerSesion());
    window.addEventListener("sesionActualizada", manejarCambioSesion);
    return () => window.removeEventListener("sesionActualizada", manejarCambioSesion);
  }, []);

  //si hay alguien logeado muestra va al panel
  const accionesDinamicas = acciones.map((accion) => {
    if (accion.id === "nav-login" && usuario) {
      return {
        ...accion,
        text: "",
        url: `/${usuario.rol || "inquilino"}`,
        title: `Ir a mi panel (${usuario.nombre || "Usuario"})`,
        ariaLabel: "Ir a mi panel privado",
      };
    }
    return accion;
  });

  const accionesMobileBase = accionesMobile ?? acciones;
  const botonesMobile = accionesMobileBase.map((accion) => {
    if (accion.id === "nav-login-m" && usuario) {
      return {
        ...accion,
        text: `Mi Panel (${usuario.nombre?.split(" ")[0] || "Usuario"})`,
        url: `/${usuario.rol || "inquilino"}`,
      };
    }
    return accion;
  });

  // Efecto de scroll en la barra de navegación solo en home
  useEffect(() => {
  const handleScroll = () => {
    if (!esHome) {
      setScrolled(true);
      return;
    }

    setScrolled(window.scrollY > 40);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => window.removeEventListener("scroll", handleScroll);
  }, [esHome]);

  // Enlace de navegación activo al hacer scroll dentro de la página actual (#)
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const esAncla = (url) => url?.startsWith("#");
  const closeMobileNav = () => setMobileOpen(false);

  // Desplazamiento suave para enlaces ancla (#seccion)
  const handleAnchorClick = (event, url) => {
    const target = document.querySelector(url);
    if (target) {
      event.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    closeMobileNav();
  };

  const navbarClases = ["navbar", scrolled && "scrolled", mobileOpen && "nav-open"]
    .filter(Boolean)
    .join(" ");

  // Un link del menú: <a> si es ancla, <NavLink> si es ruta real.
  const renderEnlace = (enlace, onNavigate) =>
    esAncla(enlace.url) ? (
      <a
        key={enlace.id}
        href={enlace.url}
        id={enlace.id}
        className={`nav-link${activeHref === enlace.url ? " active" : ""}`}
        onClick={(e) => handleAnchorClick(e, enlace.url)}
      >
        {enlace.text}
      </a>
    ) : (
      <NavLink
        key={enlace.id}
        to={enlace.url}
        id={enlace.id}
        end={enlace.url === "/"}
        className="nav-link"
        onClick={onNavigate}
      >
        {enlace.text}
      </NavLink>
    );

  // Un botón de acción: <a> si es ancla, <Link> si es ruta real.
  const renderAccion = (accion, onNavigate) => {
    const contenido = (
      <>
        {accion.icon && <UserIcon />}
        {accion.text}
      </>
    );
    const clave = accion.id ?? accion.text;

    return esAncla(accion.url) ? (
      <a
        key={clave}
        href={accion.url}
        id={accion.id}
        className={accion.className || "nav-cta"}
        style={accion.style}
        aria-label={accion.ariaLabel}
        title={accion.title}
        onClick={(e) => handleAnchorClick(e, accion.url)}
      >
        {contenido}
      </a>
    ) : (
      <Link
        key={clave}
        to={accion.url}
        id={accion.id}
        className={accion.className || "nav-cta"}
        style={accion.style}
        aria-label={accion.ariaLabel}
        title={accion.title}
        onClick={onNavigate}
      >
        {contenido}
      </Link>
    );
  };

  return (
    <header>
      {/* Barra de navegación (desktop) */}
      <nav id="navbar" className={navbarClases} aria-label="Navegación principal">
        <Link to="/" className="nav-logo" aria-label={`${marca} - Inicio`}>
          <img src={logoLight} alt={marca} className="logo-light" />
          <img src={logoDark} alt={marca} className="logo-dark" />
          <span className="logo-text">{marca}</span>
        </Link>

        <ul className="nav-menu">
          {enlaces.map((enlace) => (
            <li key={enlace.id}>{renderEnlace(enlace)}</li>
          ))}
        </ul>

        <div className="nav-actions">
          {accionesDinamicas.map((accion) => renderAccion(accion))}
        </div>

        <button
          className={`hamburger${mobileOpen ? " open" : ""}`}
          id="hamburger"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          aria-controls="mobileNav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Navegación móvil */}
      <nav id="mobileNav" className={`mobile-nav${mobileOpen ? " open" : ""}`} aria-label="Menú móvil">
        {enlaces.map((enlace) => renderEnlace(enlace, closeMobileNav))}

        <div className="mobile-nav-actions" style={{ flexDirection: "column", gap: "0.5rem" }}>
          {botonesMobile.map((accion) => renderAccion(accion, closeMobileNav))}
        </div>
      </nav>
    </header>
  );
}