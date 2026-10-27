import React, { useState } from 'react';
import '../styles/GaleriaInmueble.css';

export default function GaleriaInmueble({ imagenes = [], titulo = '' }) {
  const [indiceActual, setIndiceActual] = useState(0);

  const listaImagenes = Array.isArray(imagenes) && imagenes.length > 0
    ? imagenes.map(img => (typeof img === 'string' ? img : img.url))
    : [];

  const fotoActual = listaImagenes[indiceActual] || '/placeholder.jpg';

  const siguienteImagen = () => {
    if (listaImagenes.length === 0) return;
    setIndiceActual((prev) => (prev + 1) % listaImagenes.length);
  };

  const anteriorImagen = () => {
    if (listaImagenes.length === 0) return;
    setIndiceActual((prev) => (prev - 1 + listaImagenes.length) % listaImagenes.length);
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
          {listaImagenes.length > 1 && (
            <button
              className="carousel-btn prev-btn"
              aria-label="Anterior"
              onClick={anteriorImagen}
            >
              ‹
            </button>
          )}

          <div
            className="carousel-track"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000'
            }}
          >
            <img
              src={fotoActual}
              alt={`${titulo} - Foto ${indiceActual + 1}`}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover'
              }}
            />
          </div>

          {listaImagenes.length > 1 && (
            <button
              className="carousel-btn next-btn"
              aria-label="Siguiente"
              onClick={siguienteImagen}
            >
              ›
            </button>
          )}

          {listaImagenes.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px'
              }}
            >
              {indiceActual + 1} / {listaImagenes.length}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}