export default function Sidebar({
  titulo = 'Mi Panel',
  grupos = [],
  seccionActiva,
  onSeleccionar,
  onCerrarSesion,
}) {
  const obtenerEstiloBoton = (id) => {
    const esActivo = seccionActiva === id
    return {
      clase: `btn border-0 text-start rounded-3 px-3 py-2 d-flex align-items-center gap-3 w-100 transition-all ${
        esActivo ? 'fw-bold' : 'text-secondary'
      }`,
      estilo: {
        backgroundColor: esActivo ? '#edf2f7' : 'transparent',
        color: esActivo ? '#13284c' : 'inherit',
        cursor: 'pointer',
      },
      colorIcono: esActivo ? '#13284c' : '#6c757d',
    }
  }

  return (
    <aside className="col-lg-3">
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
        {grupos.map((grupo, index) => (
          <div key={grupo.subtitulo || index}>
            {grupo.subtitulo && (
              <p
                className="text-uppercase fw-bold text-muted px-3 mb-2"
                style={{ fontSize: '0.7rem', letterSpacing: '1px' }}
              >
                {grupo.subtitulo}
              </p>
            )}

            <nav className="nav flex-column gap-1 mb-2">
              {grupo.items.map((item) => {
                const { clase, estilo, colorIcono } = obtenerEstiloBoton(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSeleccionar && onSeleccionar(item.id)}
                    className={clase}
                    style={estilo}
                  >
                    {typeof item.icon === 'function' ? item.icon(colorIcono) : item.icon}
                    <span className="small">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {index < grupos.length - 1 && (
              <hr className="my-2 text-secondary opacity-25" />
            )}
          </div>
        ))}

        <hr className="my-2 text-secondary opacity-25" />

        {onCerrarSesion && (
          <button
            type="button"
            className="btn border-0 text-start rounded-3 px-3 py-2 d-flex align-items-center gap-3 text-danger fw-bold w-100"
            onClick={onCerrarSesion}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="small">Cerrar sesión</span>
          </button>
        )}
      </div>
    </aside>
  )
}
