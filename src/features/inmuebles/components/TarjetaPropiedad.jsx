import { Link } from "react-router";
import { formatearPrecio, capitalizar } from "../../../shared/utils/formato";

function TarjetaPropiedad({ propiedad, onConsultar }) {
  const esAlquiler = propiedad.tipo === "alquiler";

  return (
    <article className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
      <div
        className="position-relative overflow-hidden"
        style={{ height: "220px" }}
      >
        <Link to={`/inmueble/${propiedad.id}`}>
          <img
            src={propiedad.img}
            className="w-100 h-100 object-fit-cover"
            alt={propiedad.titulo}
          />
        </Link>

        <button
          type="button"
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm d-flex align-items-center justify-content-center"
          style={{ width: "36px", height: "36px" }}
          aria-label="Guardar en favoritos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <span
          className="badge bg-dark bg-opacity-75 text-uppercase position-absolute bottom-0 end-0 m-3 px-3 py-2 rounded-2"
          style={{ fontSize: "0.7rem", letterSpacing: "0.5px",color: '#d1d5db' }}
        >
          {capitalizar(propiedad.tipo)}
        </span>
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          <h4 className="fw-bold mb-1">
            {formatearPrecio(propiedad.precio)}
            {esAlquiler && (
              <span className="fs-6 text-muted fw-normal"> /mes</span>
            )}
          </h4>

          <h6 className="fw-bold text-break mb-1" title={propiedad.titulo}>
            <Link
              to={`/inmueble/${propiedad.id}`}
              className="text-decoration-none"   style={{ color: "#13284c" }}
            >
              {propiedad.titulo}
            </Link>
          </h6>

          <p className="text-secondary small mb-3 d-flex align-items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-geo-alt"
              viewBox="0 0 16 16"
            >
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <span>{propiedad.zona}</span>
          </p>
        </div>

        <div>
          <div className="border-top pt-2 mt-2 d-flex justify-content-between text-secondary small">
            {propiedad.amb && (
              <span className="d-flex align-items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {propiedad.amb} Amb.
              </span>
            )}

            {propiedad.banos && (
              <span className="d-flex align-items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                  <path d="M6 12V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v7" />
                </svg>
                {propiedad.banos} Baños
              </span>
            )}

            {propiedad.m2 && (
              <span className="d-flex align-items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                {propiedad.m2} m²
              </span>
            )}
          </div>

          {onConsultar && (
            <button
              type="button"
              className="btn btn-sm btn-outline-dark w-100 mt-3 rounded-pill fw-medium"
              onClick={() => onConsultar(propiedad)}
            >
              Consultar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default TarjetaPropiedad;
