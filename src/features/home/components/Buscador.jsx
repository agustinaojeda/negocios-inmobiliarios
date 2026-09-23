import React, { useState } from 'react';
import './Buscador.css';
import { useOutletContext } from 'react-router';

export default function Buscador() {
  const [location, setLocation] = useState('');
  const [tipo, setTipo] = useState('');
  const [operacion, setOperacion] = useState('');
  
  const { mostrarToast } = useOutletContext();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', { 
      location: location.trim(), 
      tipo, 
      operacion 
    });
    
    mostrarToast(`Buscando propiedades${location.trim() ? ' en ' + location.trim() : ''}…`);
  };

  return (
    <form 
      className="hero-search" 
      id="searchForm" 
      role="search" 
      aria-label="Buscar propiedades"
      onSubmit={handleSearch}
    >
      {/* Ubicación */}
      <div className="search-group">
        <label htmlFor="searchLocation">Ubicación</label>
        <input 
          type="text" 
          id="searchLocation" 
          name="location" 
          placeholder="Barrio, ciudad o provincia…"
          autoComplete="off" 
          aria-label="Ingresar ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Tipo de propiedad */}
      <div className="search-group">
        <label htmlFor="searchTipo">Tipo</label>
        <select 
          id="searchTipo" 
          name="tipo" 
          aria-label="Tipo de propiedad" 
          className="custom-select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Cualquier tipo</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="ph">PH</option>
          <option value="duplex">Dúplex</option>
          <option value="campo">Campo</option>
        </select>
      </div>

      {/* Operación */}
      <div className="search-group">
        <label htmlFor="searchOperacion">Operación</label>
        <select 
          id="searchOperacion" 
          name="operacion" 
          aria-label="Tipo de operación" 
          className="custom-select"
          value={operacion}
          onChange={(e) => setOperacion(e.target.value)}
        >
          <option value="">Venta y alquiler</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {/* Botón buscar */}
      <button type="submit" className="btn-search" id="btn-buscar" aria-label="Buscar propiedades">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Buscar
      </button>
    </form>
  );
}