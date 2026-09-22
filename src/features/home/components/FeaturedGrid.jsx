import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import './FeaturedGrid.css';

// Datos iniciales de prueba
const initialProperties = [
  { 
    id: 1, 
    operacion: 'venta', 
    tipo: 'casa', 
    price: 280000, 
    priceFormatted: 'USD 280.000', 
    unit: '', 
    title: 'Casa Moderna con Vista Panorámica', 
    location: 'Nordelta, Buenos Aires', 
    ambientes: 4, 
    banos: 3, 
    area: 320, 
    operacionText: 'Venta', 
    image: '/img/propiedades/prop1.jpg',
    delay: 1 
  },
  { 
    id: 2, 
    operacion: 'alquiler', 
    tipo: 'departamento', 
    price: 1800, 
    priceFormatted: 'USD 1.800', 
    unit: '/mes', 
    title: 'Departamento con Terraza y Vista', 
    location: 'Palermo, CABA', 
    ambientes: 3, 
    banos: 2, 
    area: 120, 
    operacionText: 'Alquiler', 
    image: '/img/propiedades/prop2.jpg', 
    delay: 2 
  },
  { 
    id: 3, 
    operacion: 'venta', 
    tipo: 'casa', 
    price: 195000, 
    priceFormatted: 'USD 195.000', 
    unit: '', 
    title: 'Casa Familiar con Jardín y Pileta', 
    location: 'Tigre, Buenos Aires', 
    ambientes: 5, 
    banos: 3, 
    area: 480, 
    operacionText: 'Venta', 
    image: '/img/propiedades/prop3.jpg', 
    delay: 3 
  },
  { 
    id: 4, 
    operacion: 'venta', 
    tipo: 'ph', 
    price: 520000, 
    priceFormatted: 'USD 520.000', 
    unit: '', 
    title: 'PH Premium con Vista a Buenos Aires', 
    location: 'Puerto Madero, CABA', 
    ambientes: 5, 
    banos: 4, 
    area: 290, 
    operacionText: 'Venta', 
    image: '/img/propiedades/prop4.jpg', 
    delay: 1 
  }
];

export default function FeaturedGrid() {
  const [properties, setProperties] = useState(initialProperties);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  
  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const btnRef = useRef(null);

  // Lógica de Filtrado y Ordenamiento
  useEffect(() => {
    let result = [...initialProperties];

    // Aplicar filtro
    if (filter !== 'all') {
      result = result.filter(p => p.operacion === filter || p.tipo === filter);
    }

    // Aplicar ordenamiento
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest (basado en id, mayor a menor)
      result.sort((a, b) => b.id - a.id);
    }

    setProperties(result);
  }, [filter, sort]);

  // Animaciones ScrollReveal para los elementos que no son tarjetas
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

    if (headerRef.current) observer.observe(headerRef.current);
    if (controlsRef.current) observer.observe(controlsRef.current);
    if (btnRef.current) observer.observe(btnRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="propiedades" aria-labelledby="propiedades-title">
      <div className="container">
        
        {/* Cabecera */}
        <div ref={headerRef} className="section-header reveal">
          <div>
            <span className="section-tag">Propiedades</span>
            <h2 className="section-title" id="propiedades-title">
              Listados <strong>Destacados</strong>
            </h2>
            <p className="section-subtitle">Las mejores propiedades disponibles en el mercado hoy.</p>
          </div>
          <a href="#propiedades" className="section-link">
            Ver todas
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
        </div>

        {/* Controles (Filtros y Orden) */}
        <div ref={controlsRef} className="listings-controls reveal">
          <div className="filter-tabs">
            <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todas</button>
            <button className={`filter-tab ${filter === 'venta' ? 'active' : ''}`} onClick={() => setFilter('venta')}>En venta</button>
            <button className={`filter-tab ${filter === 'alquiler' ? 'active' : ''}`} onClick={() => setFilter('alquiler')}>En alquiler</button>
            <button className={`filter-tab ${filter === 'casa' ? 'active' : ''}`} onClick={() => setFilter('casa')}>Casas</button>
            <button className={`filter-tab ${filter === 'departamento' ? 'active' : ''}`} onClick={() => setFilter('departamento')}>Departamentos</button>
          </div>

          <div className="sort-control">
            <label htmlFor="sortSelect" style={{ whiteSpace: 'nowrap' }}>Ordenar por:</label>
            <select id="sortSelect" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar propiedades">
              <option value="newest">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {/* Grilla */}
        <div className="properties-grid">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>

        {/* Botón Cargar Más */}
        <div ref={btnRef} className="load-more-wrap reveal">
          <button className="btn-load-more" aria-label="Cargar más propiedades">
            Cargar más propiedades
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
          </button>
        </div>

      </div>
    </section>
  );
}