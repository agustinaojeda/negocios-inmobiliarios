import React, { useEffect, useRef } from 'react';
import "./Testimonials.css";

const testimonialsData = [
  {
    id: 1,
    text: '"Excelente atención desde el primer contacto. Me ayudaron a encontrar el departamento perfecto en Palermo en menos de 3 semanas. Súper recomendables, muy profesionales y atentos."',
    initials: 'ML',
    name: 'María Laura Pérez',
    operation: 'Compró en Palermo · 2024',
    delay: 1
  },
  {
    id: 2,
    text: '"Vendimos nuestra casa en Nordelta en tiempo récord y al precio que pedíamos. El equipo gestionó todo el proceso legal, fue una experiencia sin estrés. Muy agradecidos."',
    initials: 'JR',
    name: 'Javier Rodríguez',
    operation: 'Vendió en Nordelta · 2024',
    delay: 2
  },
  {
    id: 3,
    text: '"Como inversor inmobiliario necesitaba una inmobiliaria confiable. Me dieron análisis de mercado muy completos que me permitieron tomar la mejor decisión. Claramente los mejores."',
    initials: 'CA',
    name: 'Carlos Almada',
    operation: 'Invirtió en Puerto Madero · 2025',
    delay: 3
  }
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

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

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.offsetWidth;
      trackRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="testimonials" aria-labelledby="testimonials-title" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div>
            <span className="section-tag">Testimonios</span>
            <h2 className="section-title" id="testimonials-title">
              Lo que dicen<br /><strong>Nuestros Clientes</strong>
            </h2>
          </div>
        </div>

        <div className="testimonials-carousel-container">
          <button 
            className="testimonials-carousel-btn prev" 
            aria-label="Testimonio anterior" 
            onClick={() => scroll('prev')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div className="testimonials-grid" id="testimonialsTrack" ref={trackRef}>
            {testimonialsData.map((item) => (
              <div key={item.id} className={`testimonial-card reveal reveal-delay-${item.delay}`}>
                <div className="testimonial-stars" aria-hidden="true">★★★★★</div>
                <p className="testimonial-text">{item.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar" aria-hidden="true">{item.initials}</div>
                  <div>
                    <div className="author-name">{item.name}</div>
                    <div className="author-op">{item.operation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="testimonials-carousel-btn next" 
            aria-label="Testimonio siguiente" 
            onClick={() => scroll('next')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}