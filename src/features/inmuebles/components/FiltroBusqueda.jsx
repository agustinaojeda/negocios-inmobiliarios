export default function FiltroBusqueda({
  busqueda,
  onBuscar,
  onEjecutarBusqueda
}) {
  return (
    <div className="bg-white rounded-pill p-1 pb-2 shadow-lg border text-dark w-100">
      <div className="row g-2 align-items-center m-0">

        <div className="col-12 col-md-9 col-lg-10 px-3 mb-2 mb-md-0">
          <input
            id="hero-ubicacion"
            type="text"
            className="form-control border-0 shadow-none p-0 bg-transparent text-secondary"
            placeholder="Escribí acá para buscar por nombre o zona..."
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-3 col-lg-2 d-grid">
          <button
            type="button"
            className="btn rounded-pill py-2 px-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
            style={{ backgroundColor: '#13284c', borderColor: '#13284c' }}
            onClick={onEjecutarBusqueda}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="currentColor" 
              className="bi bi-search" 
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
            <span>Buscar</span>
          </button>
        </div>

      </div>
    </div>
  );
}