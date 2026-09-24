import React, { useState } from 'react';
import './GaleriaInmueble.css';

export default function GaleriaInmueble({ imagen, titulo }) {
  const [animando, setAnimando] = useState(false);

  const cambiarImagen = () => {
    setAnimando(true);

    
    setTimeout(() => {
      setAnimando(false);
    }, 500);
  };

  return (
    <section className="gallery-section" aria-label="Galería de fotos">
      <div className="container">
        <div
          className="property-carousel"
          style={{
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <button
            className="carousel-btn prev-btn"
            aria-label="Anterior"
            onClick={cambiarImagen}
          >
            ‹
          </button>

          <div
            className="carousel-track"
            style={{
              display: 'flex',
              transform: animando
                ? 'translateX(-100%)'
                : 'translateX(0)',
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            <img
              src={imagen}
              alt={`${titulo} - Foto`}
              style={{
                flex: '0 0 100%',
                width: '100%',
                height: '500px',
                objectFit: 'cover'
              }}
            />

            {/* Copia necesaria solamente para crear el efecto visual */}
            <img
              src={imagen}
              alt=""
              aria-hidden="true"
              style={{
                flex: '0 0 100%',
                width: '100%',
                height: '500px',
                objectFit: 'cover'
              }}
            />
          </div>

          <button
            className="carousel-btn next-btn"
            aria-label="Siguiente"
            onClick={cambiarImagen}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
