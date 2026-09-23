export default function Sidebar({ seccionActiva, onSeleccionar, onCerrarSesion }) {
  const obtenerEstiloBoton = (id) => { {/**le cambia el colorcito al boton que esta seleccionado */}
    const esActivo = seccionActiva === id
    return {
      clase: `btn border-0 text-start rounded-3 px-3 py-2 d-flex align-items-center gap-3 ${
        esActivo ? 'fw-bold' : 'text-secondary'
      }`,
      estilo: {
        backgroundColor: esActivo ? '#edf2f7' : 'transparent',
        color: esActivo ? '#13284c' : 'inherit'
      },
      colorIcono: esActivo ? '#13284c' : '#6c757d'
    }
  }

  return (
    <aside className="col-lg-3"  >
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
        
        <p className="text-uppercase fw-bold text-muted px-3 mb-2" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
          Mi Cuenta
        </p>
        
        <nav className="nav flex-column gap-1 mb-2" >
          {(() => {
            const { clase, estilo, colorIcono } = obtenerEstiloBoton('contacto')
            return (
              <button
                type="button"
                onClick={() => onSeleccionar('contacto')}
                className={clase}
                style={estilo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={colorIcono} strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="small">Información de contacto</span>
              </button>
            )
          })()}

          {(() => {
            const { clase, estilo, colorIcono } = obtenerEstiloBoton('favoritos')
            return (
              <button
                type="button"
                onClick={() => onSeleccionar('favoritos')}
                className={clase}
                style={estilo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={colorIcono} viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="small">Mis Favoritos</span>
              </button>
            )
          })()}

          {(() => {
            const { clase, estilo, colorIcono } = obtenerEstiloBoton('citas')
            return (
              <button
                type="button"
                onClick={() => onSeleccionar('citas')}
                className={clase}
                style={estilo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={colorIcono} strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="small">Mis Citas</span>
              </button>
            )
          })()}

          {(() => {
            const { clase, estilo, colorIcono } = obtenerEstiloBoton('alertas')
            return (
              <button
                type="button"
                onClick={() => onSeleccionar('alertas')}
                className={clase}
                style={estilo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={colorIcono} strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="small">Alertas de precio</span>
              </button>
            )
          })()}
        </nav>

        <hr className="my-2 text-secondary opacity-25" />

        <nav className="nav flex-column gap-1 mb-2">
          {(() => {
            const { clase, estilo, colorIcono } = obtenerEstiloBoton('asignados')
            return (
              <button
                type="button"
                onClick={() => onSeleccionar('asignados')}
                className={clase}
                style={estilo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={colorIcono} strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span className="small">Inmuebles Asignados</span>
              </button>
            )
          })()}

          {(() => {
            const { clase, estilo, colorIcono } = obtenerEstiloBoton('seguridad')
            return (
              <button
                type="button"
                onClick={() => onSeleccionar('seguridad')}
                className={clase}
                style={estilo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={colorIcono} strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="small">Seguridad</span>
              </button>
            )
          })()}
        </nav>

        <hr className="my-2 text-secondary opacity-25" />

        <button
          type="button"
          className="btn border-0 text-start rounded-3 px-3 py-2 d-flex align-items-center gap-3 text-danger fw-bold"
          onClick={onCerrarSesion}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="small">Cerrar sesión</span>
        </button>

      </div>
    </aside>
  )
}