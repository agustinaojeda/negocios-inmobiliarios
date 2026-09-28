import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router'; 
import { useFetch } from '../../../shared/hooks/useFetch';
import { obtenerUltimas } from '../services/inmueblesService';
import GrillaPropiedades from '../../../shared/components/propiedades/GrillaPropiedades';
import './PropiedadesSimilares.css';

export default function PropiedadesSimilares() {
  // Traemos las últimas 3 propiedades disponibles
  const { datos: propiedades, cargando, error } = useFetch(obtenerUltimas, 3);
  
  const headerRef = useRef(null);

  // Animación ScrollReveal para el header
  // Animación ScrollReveal para el header
  useEffect(() => {
    // Si todavía está cargando, no hacemos nada
    if (cargando || !propiedades) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
    
  }, [cargando, propiedades]);

  if (cargando || error || !propiedades || propiedades.length === 0) return null;

  return (
    <section className="similar-section" aria-labelledby="similar-title">
      <div className="container">
        
        {/* Header de la sección */}
        <div ref={headerRef} className="section-header reveal">
          <div>
            <span className="section-tag">También te puede interesar</span>
            <h2 className="section-title" id="similar-title">Propiedades <strong>Similares</strong></h2>
          </div>

          {/* Enlace corregido usando React Router */}
          <Link to="/inmuebles" className="section-link" id="link-ver-similares">
            Ver todas
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Contenedor del Carrusel / Grilla */}
        <div className="similar-carousel-container">
          
          <button className="similar-carousel-btn prev" aria-label="Propiedad anterior" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div className="similar-grid-wrapper">
             <GrillaPropiedades propiedades={propiedades} />
          </div>

          <button className="similar-carousel-btn next" aria-label="Propiedad siguiente" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          
        </div>
      </div>
    </section>
  );
}