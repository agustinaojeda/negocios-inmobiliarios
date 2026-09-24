import React from 'react';
import './FichaTecnica.css';

export default function FichaTecnica({ propiedad }) {
  const precioFormateado = propiedad.precio.toLocaleString('es-AR');
  const categoriaCapitalizada = propiedad.categoria.charAt(0).toUpperCase() + propiedad.categoria.slice(1);
  const tipoCapitalizado = propiedad.tipo.charAt(0).toUpperCase() + propiedad.tipo.slice(1);

  return (
    <div className="detail-main">
      <div className="prop-header reveal visible">
        <div className="prop-price-row">
          <div>
            <div className="prop-price">USD {precioFormateado}</div>
            <div className="prop-price-sub">Expensas: Consultar</div>
          </div>
        </div>
        <h1 className="prop-title">{propiedad.titulo}</h1>
        <p className="prop-address">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          {propiedad.direccion}, {propiedad.zona}
        </p>
      </div>

      <div className="prop-stats reveal visible">
        <div className="prop-stat">
          <div className="prop-stat-value">{propiedad.amb}</div>
          <div className="prop-stat-label">Ambientes</div>
        </div>
        <div className="prop-stat">
          <div className="prop-stat-value">{propiedad.banos}</div>
          <div className="prop-stat-label">Baños</div>
        </div>
        <div className="prop-stat">
          <div className="prop-stat-value">{propiedad.m2}</div>
          <div className="prop-stat-label">m² cubiertos</div>
        </div>
      </div>

      <div className="prop-section reveal visible">
        <h2 className="prop-section-title">Sobre esta propiedad</h2>
        <div className="prop-desc-container">
          <p className="prop-desc">{propiedad.desc}</p>
        </div>
      </div>

      {/* Características Destacadas */}
      <div className="prop-section reveal visible">
        <h2 className="prop-section-title">Características Destacadas</h2>
        <ul className="features-grid" aria-label="Características de la propiedad">
          <li className="feature-item">
            <span className="feature-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20M2 18h20M7 8c2.6 0 3-3 5-3s2.4 3 5 3" />
              </svg>
            </span>
            Excelente Iluminación
          </li>
          <li className="feature-item">
            <span className="feature-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </span>
            Apta Crédito
          </li>
          <li className="feature-item">
            <span className="feature-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            Zona Segura
          </li>
        </ul>
      </div>

      {/*Ficha Técnica */}
      <div className="prop-section reveal visible">
        <h2 className="prop-section-title">Ficha Técnica</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem' }}>
          <div className="info-row" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span className="info-row-label">Tipo</span>
            <span className="info-row-value">{categoriaCapitalizada}</span>
          </div>
          <div className="info-row" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span className="info-row-label">Operación</span>
            <span className="info-row-value">{tipoCapitalizado}</span>
          </div>
          <div className="info-row" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span className="info-row-label">Sup. cubierta</span>
            <span className="info-row-value">{propiedad.m2} m²</span>
          </div>
          <div className="info-row" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span className="info-row-label">Ambientes</span>
            <span className="info-row-value">{propiedad.amb}</span>
          </div>
          <div className="info-row" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span className="info-row-label">Baños</span>
            <span className="info-row-value">{propiedad.banos}</span>
          </div>
          <div className="info-row" style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--gray-100)' }}>
            <span className="info-row-label">Barrio</span>
            <span className="info-row-value">{propiedad.zona}</span>
          </div>
        </div>
      </div>

      <div className="prop-section reveal visible">
        <h2 className="prop-section-title">Ubicación</h2>
        <div className="map-placeholder" role="button" tabIndex="0" onClick={() => window.open(`https://maps.google.com/?q=${propiedad.direccion}+${propiedad.zona}`,'_blank')}>
          <span className="map-pin" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </span>
          <span className="map-address">{propiedad.direccion}, {propiedad.zona}</span>
          <span className="map-label">Clic para ver en Google Maps</span>
        </div>
      </div>
    </div>
  );
}