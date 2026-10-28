import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import PropertyCard from '../../../shared/components/propiedades/PropertyCard';
import Spinner from '../../../shared/components/Spinner';
import MensajeVacio from '../../../shared/components/MensajeVacio';
import { useFetch } from '../../../shared/hooks/useFetch';
import { obtenerPropiedadesDisponibles } from '../../inmuebles/services/inmueblesService';
import { useFiltros } from '../../inmuebles/hooks/useFiltros'; 
import '../styles/FeaturedGrid.css'; 

export default function FeaturedGrid({ busqueda = '' }) {
  const { datos: propiedades, cargando, error } = useFetch(obtenerPropiedadesDisponibles);
  const [sort, setSort] = useState('newest');
  const [activeTab, setActiveTab] = useState('todas');
  const [mostrarTodas, setMostrarTodas] = useState(false);
  
  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const btnRef = useRef(null);

  const { 
    setCategoria, 
    propiedadesFiltradas,
    limpiarFiltros 
  } = useFiltros(propiedades);

  const handleFilterClick = (filterValue, filterType) => {
    setActiveTab(filterValue);
    limpiarFiltros();
    setMostrarTodas(false);
    
    if (filterType === 'categoria') {
      setCategoria(filterValue);
    }
  };

  const texto = busqueda.trim().toLowerCase();

  const sortedProperties = [...propiedadesFiltradas]
    .filter((p) => p.titulo.toLowerCase().includes(texto) || p.zona.toLowerCase().includes(texto))
    .sort((a, b) => {
      if (sort === 'price-asc') return Number(a.precio) - Number(b.precio);
      if (sort === 'price-desc') return Number(b.precio) - Number(a.precio);
      return new Date(b.fecha_actualizacion || b.fecha_creacion || 0) - new Date(a.fecha_actualizacion || a.fecha_creacion || 0); 
    });

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
          <Link to="/inmuebles" className="section-link">
            Ver todas
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>
        </div>

        <div ref={controlsRef} className="listings-controls reveal">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeTab === 'todas' ? 'active' : ''}`} 
              onClick={() => handleFilterClick('todas', 'todas')}>
                Todas
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

        {cargando && <Spinner texto="Cargando propiedades..." />}

        {error && (
          <MensajeVacio titulo="No pudimos cargar las propiedades" texto={error.message} />
        )}

        {!cargando && !error && (
          <div className="properties-grid">
            {propiedadesAMostrar.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        {!cargando && !error && sortedProperties.length === 0 && (
          <MensajeVacio titulo="No se encontraron propiedades" texto="Probá con otra zona o categoría." />
        )}

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