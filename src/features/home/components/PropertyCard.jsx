import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router";

export default function PropertyCard({ property }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/inmueble/${property.id}`); 
  };

  // Formateo de datos provenientes del JSON
  const precioFormateado = property.precio.toLocaleString('es-AR');
  const tipoOperacion = property.tipo.charAt(0).toUpperCase() + property.tipo.slice(1);
  const estadoTexto = property.estado.toUpperCase();

  return (
    <article 
      ref={cardRef}
      className={`property-card reveal reveal-delay-1 ${isVisible ? 'visible' : ''}`} 
      onClick={handleCardClick}
    >
      <div className="card-image-wrap">
        <img src={property.img} alt={property.titulo} loading="lazy" width="400" height="300" />

        <button 
          className={`card-favorite ${isFavorite ? 'active' : ''}`} 
          onClick={handleFavoriteClick}
          aria-label="Guardar en favoritos" 
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          )}
        </button>

        <span className={`card-badge badge-${property.estado.toLowerCase()}`}>
          {estadoTexto}
        </span>

        <span className="card-type">{tipoOperacion}</span>
      </div>

      <div className="card-body">
        <div className="card-price">
          USD {precioFormateado}<span className="card-price-unit">{property.unit}</span>
        </div>

        <h3 className="card-title">{property.titulo}</h3>

        <p className="card-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          {property.zona}, {property.direccion}
        </p>

        <div className="card-features">
          <div className="card-feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            {property.amb} Amb.
          </div>

          <div className="card-feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            {property.banos} Baños
          </div>

          <div className="card-feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
            {property.m2} m²
          </div>
        </div>
      </div>
    </article>
  );
}