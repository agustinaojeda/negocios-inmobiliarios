import React, { useEffect, useRef } from 'react';
import "./WhyUs.css";

export default function WhyUs() {
  const sectionRef = useRef(null);

  // Animación de aparición (Scroll Reveal)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const reveals = sectionRef.current.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-us" id="nosotros" aria-labelledby="why-title" ref={sectionRef}>
      <div className="container">
        <div className="why-grid">
          
          {/* Imagen y Tarjeta Flotante */}
          <div className="why-image-wrap reveal">
            <img 
              src="/img/propiedades/prop2.jpg" 
              alt="Asesor inmobiliario profesional" 
              loading="lazy" 
              width="600" 
              height="750" 
            />
            <div className="why-card-float">
              <div className="why-float-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
              <div>
                <div className="why-float-value">+15</div>
                <div className="why-float-label">Años en el mercado</div>
              </div>
            </div>
          </div>

          {/* Contenido y Beneficios */}
          <div className="why-features reveal">
            <div>
              <span className="section-tag">¿Por qué elegirnos?</span>
              <h2 className="section-title" id="why-title" style={{ color: 'var(--white)' }}>
                Experiencia que<br /><strong>Genera Resultados</strong>
              </h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Con más de 15 años en el mercado inmobiliario argentino, te acompañamos en cada paso con profesionalismo y transparencia.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2rem' }}>
              <div className="why-feature">
                <div className="why-feature-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <div>
                  <div className="why-feature-title">Búsqueda Personalizada</div>
                  <div className="why-feature-desc">Analizamos tus necesidades y encontramos propiedades que se ajustan exactamente a lo que buscás, ahorrándote tiempo y esfuerzo.</div>
                </div>
              </div>

              <div className="why-feature">
                <div className="why-feature-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <div>
                  <div className="why-feature-title">Gestión Legal Completa</div>
                  <div className="why-feature-desc">Nos encargamos de toda la documentación, escrituras y trámites para que tu operación sea 100% segura y sin sorpresas.</div>
                </div>
              </div>

              <div className="why-feature">
                <div className="why-feature-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <div className="why-feature-title">Asesoramiento Continuo</div>
                  <div className="why-feature-desc">Tu asesor personal te acompaña antes, durante y después de la operación, respondiendo todas tus dudas cuando las necesitás.</div>
                </div>
              </div>

              <div className="why-feature">
                <div className="why-feature-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="why-feature-title">Valuación Profesional</div>
                  <div className="why-feature-desc">Tasamos tu propiedad al precio justo de mercado con análisis comparativo actualizado, maximizando tu inversión.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}