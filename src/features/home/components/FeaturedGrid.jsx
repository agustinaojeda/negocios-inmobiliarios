import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import { useFiltros } from '../../inmuebles/hooks/useFiltros'; // Ajusta la ruta según tu proyecto
import './FeaturedGrid.css'; 

export default function FeaturedGrid() {
  const [propertiesDB, setPropertiesDB] = useState([]);
  const [sort, setSort] = useState('newest');
  const [activeTab, setActiveTab] = useState('todas');
  
  // Nuevo estado para controlar si se muestran todas las propiedades
  const [mostrarTodas, setMostrarTodas] = useState(false);
  
  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    fetch('/data/propiedades.json')
      .then(res => res.json())
      .then(data => setPropertiesDB(data))
      .catch(err => console.error("Error al cargar propiedades:", err));
  }, []);

  const { 
    setTipo, 
    setCategoria, 
    propiedadesFiltradas,
    limpiarFiltros 
  } = useFiltros(propertiesDB);

  const handleFilterClick = (filterValue, filterType) => {
    setActiveTab(filterValue);
    limpiarFiltros();
    
    // Al cambiar de filtro, volvemos a ocultar las tarjetas extra
    setMostrarTodas(false);

    if (filterType === 'tipo') {
      setTipo(filterValue);
    } else if (filterType === 'categoria') {
      setCategoria(filterValue);
    }
  };

  const sortedProperties = [...propiedadesFiltradas].sort((a, b) => {
    if (sort === 'price-asc') return a.precio - b.precio;
    if (sort === 'price-desc') return b.precio - a.precio;
    return b.id - a.id; 
  });

  // Determinamos cuáles propiedades mostrar según el estado 'mostrarTodas'
  const propiedadesAMostrar = mostrarTodas 
    ? sortedProperties 
    : sortedProperties.slice(0, 4);

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

        <div ref={controlsRef} className="listings-controls reveal">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeTab === 'todas' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('todas', 'todas')}>
                Todas
            </button>
            <button 
              className={`filter-tab ${activeTab === 'venta' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('venta', 'tipo')}>
                En venta
            </button>
            <button 
              className={`filter-tab ${activeTab === 'alquiler' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('alquiler', 'tipo')}>
                En alquiler
            </button>
            <button 
              className={`filter-tab ${activeTab === 'casa' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('casa', 'categoria')}>
                Casas
            </button>
            <button 
              className={`filter-tab ${activeTab === 'departamento' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('departamento', 'categoria')}>
                Departamentos
            </button>
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

        <div className="properties-grid">
          {/* Mapeamos el arreglo derivado 'propiedadesAMostrar' */}
          {propiedadesAMostrar.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>

        {/* Solo mostramos el botón si hay más de 4 propiedades y 'mostrarTodas' es falso */}
        
          <div ref={btnRef} className="load-more-wrap reveal">
            {!mostrarTodas && sortedProperties.length > 4 && (
            <button 
              className="btn-load-more" 
              aria-label="Cargar más propiedades"
              onClick={() => setMostrarTodas(true)}
            >
              Cargar más propiedades
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
            </button>
            )}
          </div>
        

      </div>
    </section>
  );
}