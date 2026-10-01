// Card unificada para Propiedades, Favoritos, Citas e Inmuebles Asignados
// - Normal: <PropertyCard property={propiedad} />
// - Citas: <PropertyCard cita={miCita} />
// - Asignados: <PropertyCard property={propiedad} esAsignado={true} />

import { Link } from "react-router";
import React, { useState, useEffect, useRef } from "react";
import { formatearPrecio, capitalizar } from "../../../shared/utils/formato";
import {
  esFavorito,
  toggleFavorito,
} from "../../../features/inquilino/services/favoritosService";

export default function PropertyCard({ property, cita, esAsignado = false }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Si viene una cita, la propiedad está adentro de 'cita.propiedad'. Si no, usa 'property'.
  const propData = property || cita?.propiedad;
  const esCita = Boolean(cita);
  const esAlquiler = propData?.tipo === "alquiler";

  // Cargar estado inicial de favorito (solo para modo propiedad normal, no en citas ni asignados)
  useEffect(() => {
    if (!esCita && !esAsignado && propData?.id) {
      setIsFavorite(esFavorito(propData.id));
    }
  }, [propData?.id, esCita, esAsignado]);

  // Animación de aparición (Scroll Reveal)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!propData?.id) return;

    const nuevoEstado = toggleFavorito(propData.id);
    setIsFavorite(nuevoEstado);
  };

  if (!propData) return null;

  // Mapa de colores para las Badges de Citas
  const citaBadgeStyles = {
    pendiente: "bg-warning text-dark",
    confirmada: "bg-success text-white",
    cancelada: "bg-danger text-white",
    completada: "bg-secondary text-white",
  };

  return (
    <Link to={`/inmueble/${propData.id}`} className="text-decoration-none h-100 d-block">
      <article
        ref={cardRef}
        className={`property-card h-100 d-flex flex-column reveal reveal-delay-1 ${
          isVisible ? "visible" : ""
        }`}
      >
        {/* IMAGEN + BADGE / CORAZÓN */}
        <div className="card-image-wrap position-relative">
          <img
            src={propData.img}
            alt={propData.titulo}
            loading="lazy"
            width="400"
            height="300"
          />

          {esCita ? (
            /* 1. Badge de estado para CITAS */
            <span
              className={`badge rounded-pill position-absolute top-0 end-0 m-3 px-3 py-2 text-capitalize fw-semibold ${
                citaBadgeStyles[cita.estado?.toLowerCase()] || "bg-primary text-white"
              }`}
              style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
            >
              {cita.estado}
            </span>
          ) : esAsignado ? (
            /* 2. Badge para INMUEBLES ASIGNADOS (Comprada / En alquiler) */
            <span
              className={`badge rounded-pill position-absolute top-0 end-0 m-3 px-3 py-2 fw-semibold ${
                esAlquiler ? "bg-primary text-white" : "bg-success text-white"
              }`}
              style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
            >
              {esAlquiler ? "En alquiler" : "Comprada"}
            </span>
          ) : (
            /* 3. Botón Corazón + Tag de Tipo para PROPIEDADES NORMALES */
            <>
              <button
                className={`card-favorite ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteClick}
                aria-label="Guardar en favoritos"
                aria-pressed={isFavorite}
              >
                {isFavorite ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                )}
              </button>

              {propData.tipo && (
                <span className="card-type">{capitalizar(propData.tipo)}</span>
              )}
            </>
          )}
        </div>

        {/* CUERPO DE LA CARD */}
        <div className="card-body d-flex flex-column flex-grow-1">
          {/* Precio (Solo se muestra si existe y no es una cita) */}
          {!esCita && propData.precio && (
            <div className="card-price">
              {formatearPrecio(propData.precio)}
              {esAlquiler && <span className="card-price-unit"> /mes</span>}
            </div>
          )}

          <h3 className="card-title">{propData.titulo}</h3>

          <p className="card-location mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {propData.zona || propData.direccion}
          </p>

          {/* Nombre del Asesor (Solo si es un Inmueble Asignado) */}
          {esAsignado && (
            <p className="card-agent text-muted small mt-1 mb-2 d-flex align-items-center gap-1" style={{ fontSize: "0.825rem" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Asesor: <strong>{propData.agenteNombre || "Sin asignar"}</strong></span>
            </p>
          )}

          {/* CARACTERÍSTICAS / INFORMACIÓN DE PIE */}
          <div className="card-features mt-auto">
            {esCita ? (
              /* --- INFO DE CITA --- */
              <>
                <div className="card-feature" title="Fecha">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {cita.fecha}
                </div>

                <div className="card-feature" title="Hora">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {cita.hora} hs
                </div>

                <div className="card-feature text-truncate" title="Agente">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>Agente: {cita.agenteNombre}
                </div>

                <div className="card-feature text-truncate" title="Agente">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>Cliente: {cita.clienteNombre}
                </div>
              </>
            ) : (
              /* --- INFO DE PROPIEDAD (Normal o Asignada) --- */
              <>
                <div className="card-feature">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  {propData.amb} Amb.
                </div>

                <div className="card-feature">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  {propData.banos} Baños
                </div>

                <div className="card-feature">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  {propData.m2} m²
                </div>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}