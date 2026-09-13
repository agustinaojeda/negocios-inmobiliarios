import UserIcon from "../components/icons/UserIcon";

export default function NavBar({ marca = "", acciones = [], enlaces = [] }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          {marca}
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuNavegacion"
          aria-controls="menuNavegacion"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuNavegacion">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {enlaces.map((enlace, index) => (
              <li className="nav-item" key={index}>
                <a className="nav-link" href={enlace.url}>
                  {enlace.text}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="d-flex flex-column flex-lg-row gap-2">
            {acciones.map((accion, index) => (
              <a
                key={index}
                href={accion.url}
                className={accion.className || "btn btn-outline-light"}
                title={accion.title}
                aria-label={accion.ariaLabel}
              >
                {accion.icon && <UserIcon />}
                {accion.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}