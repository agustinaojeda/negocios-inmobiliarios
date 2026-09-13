import UserIcon from "../components/icons/UserIcon";

export default function NavBar({ marca,logo,acciones,enlaces}) {
  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-1" href="/">
          {logo && <img src={logo} alt={marca} height="36" className="d-inline-block align-text-top" />}
          <span>{marca}</span>
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
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
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
                className={accion.className || "btn btn-outline-dark"}
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