import { useEffect, useState } from "react";
import UserIcon from "../components/icons/UserIcon";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(null);

  const botonesMobile = accionesMobile ?? acciones;

  // Efecto de scroll en la barra de navegación
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enlace de navegación activo al hacer scroll (solo aplica si la página
  // tiene <section id="..."> visibles, como la Home)
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

  const closeMobileNav = () => setMobileOpen(false);

  // Desplazamiento suave para enlaces ancla (#seccion) + cierre del menú móvil
  const handleLinkClick = (event, url) => {
    if (url.startsWith("#")) {
      const target = document.querySelector(url);
      if (target) {
        event.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
    closeMobileNav();
  };

  const navbarClases = ["navbar", scrolled && "scrolled", mobileOpen && "nav-open"]
    .filter(Boolean)
    .join(" ");

  return (
    <header>
      {/* Barra de navegación (desktop) */}
      <nav id="navbar" className={navbarClases} aria-label="Navegación principal">
        <a href="/" className="nav-logo" aria-label={`${marca} - Inicio`}>
          <img src={logoLight} alt={marca} className="logo-light" />
          <img src={logoDark} alt={marca} className="logo-dark" />
          <span className="logo-text">{marca}</span>
        </a>

        <ul className="nav-menu">
          {enlaces.map((enlace) => (
            <li key={enlace.id}>
              <a
                href={enlace.url}
                id={enlace.id}
                className={`nav-link${activeHref === enlace.url ? " active" : ""}`}
                onClick={(e) => handleLinkClick(e, enlace.url)}
              >
                {enlace.text}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {acciones.map((accion) => (
            <a
              key={accion.id ?? accion.text}
              href={accion.url}
              id={accion.id}
              className={accion.className || "nav-cta"}
              aria-label={accion.ariaLabel}
              title={accion.title}
              onClick={(e) => handleLinkClick(e, accion.url)}
            >
              {accion.icon && <UserIcon />}
              {accion.text}
            </a>
          ))}
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
        {enlaces.map((enlace) => (
          <a
            key={enlace.id}
            href={enlace.url}
            className="nav-link"
            onClick={(e) => handleLinkClick(e, enlace.url)}
          >
            {enlace.text}
          </a>
        ))}

        <div className="mobile-nav-actions" style={{ flexDirection: "column", gap: "0.5rem" }}>
          {botonesMobile.map((accion) => (
            <a
              key={accion.id ?? accion.text}
              href={accion.url}
              className={accion.className || "nav-cta"}
              style={accion.style}
              aria-label={accion.ariaLabel}
              title={accion.title}
              onClick={(e) => handleLinkClick(e, accion.url)}
            >
              {accion.icon && <UserIcon />}
              {accion.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
