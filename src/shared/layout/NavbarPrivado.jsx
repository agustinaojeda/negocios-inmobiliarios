import { Link } from 'react-router'
import logoDark from '/logoDark.png'
import UserIcon from '../components/icons/UserIcon'

export default function NavbarPrivado({ sesion }) {
  const formatearRol = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Administrador'
      case 'propietario':
        return 'Propietario'
      case 'agente':
        return 'Agente Inmobiliario'
      case 'inquilino':
        return 'Inquilino'
      default:
        return rol || 'Usuario'
    }
  }

  const obtenerColorBadge = (rol) => {
    switch (rol) {
      case 'admin':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
      case 'agente':
        return { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' }
      case 'propietario':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }
      case 'inquilino':
      default:
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' }
    }
  }

  const badgeEstilo = obtenerColorBadge(sesion?.rol)

  return (
    <header className="bg-white border-bottom shadow-sm sticky-top" style={{ height: '72px', zIndex: 1000 }}>
      <div className="container h-100 d-flex align-items-center justify-content-between">

        {/* Logo de la empresa */}
        <Link
          to={`/${sesion?.rol || 'inquilino'}`}
          className="d-flex align-items-center gap-2 text-decoration-none"
          title="Ir al inicio de mi panel"
        >
          <img src={logoDark} alt="Logo" style={{ height: '38px', width: 'auto' }} />
          <div className="d-flex flex-column">
            <span className="fw-bold fs-6 mb-0" style={{ color: '#13284c', lineHeight: 1.1 }}>
              Negocios Inmobiliarios
            </span>
            <span className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Portal Privado
            </span>
          </div>
        </Link>

        {/* Acciones y datos del usuario */}
        <div className="d-flex align-items-center gap-2 gap-md-3">

          {/* Botón para volver a la web pública */}
          <Link
            to="/"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-none d-sm-inline-flex align-items-center gap-2"
            title="Ver el sitio web público"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Ver Sitio Web</span>
          </Link>

          {/* Badge del Usuario y Rol */}
          <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: badgeEstilo.bg,
                color: badgeEstilo.text,
              }}
            >
              <UserIcon />
            </div>
            <div className="d-flex flex-column text-start">
              <span className="fw-bold small" style={{ color: '#13284c', lineHeight: 1.2 }}>
                {sesion?.nombre || 'Usuario'}
              </span>
              <span
                className="badge rounded-pill px-2 py-0 align-self-start"
                style={{
                  backgroundColor: badgeEstilo.bg,
                  color: badgeEstilo.text,
                  border: `1px solid ${badgeEstilo.border}`,
                  fontSize: '0.62rem',
                }}
              >
                {formatearRol(sesion?.rol)}
              </span>
            </div>
          </div>



        </div>

      </div>
    </header>
  )
}
