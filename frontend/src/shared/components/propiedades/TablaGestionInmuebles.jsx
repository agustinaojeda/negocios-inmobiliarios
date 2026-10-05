import { formatearPrecio } from '../../utils/formato'

const CLASES_ESTADO = {
  disponible: 'bg-success text-white',
  reservado: 'bg-warning text-dark',
  alquilado: 'bg-info text-dark',
  vendido: 'bg-primary text-white',
  pausado: 'bg-secondary text-white',
}

export default function TablaGestionInmuebles({
  propiedades = [],
  editableEstado = false,
  onCambiarEstado,
  onEditar,
  onEliminar,
  textoBotonEliminar = 'Baja',
}) {
  if (!propiedades || propiedades.length === 0) return null

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr className="small text-secondary">
            <th>Inmueble</th>
            <th>Zona</th>
            <th>Tipo / Op.</th>
            <th>Precio</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propiedades.map((p) => (
            <tr key={p.id}>
              {/* Foto + Título + Dirección */}
              <td>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={p.img || '/img/propiedades/prop1.jpg'}
                    alt={p.titulo}
                    className="rounded-3 object-fit-cover border"
                    style={{ width: '45px', height: '45px' }}
                    onError={(e) => {
                      e.target.src = '/img/propiedades/prop1.jpg'
                    }}
                  />
                  <div>
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '220px' }}>
                      {p.titulo}
                    </div>
                    <small className="text-muted">{p.direccion}</small>
                  </div>
                </div>
              </td>

              {/* Zona */}
              <td>{p.zona}</td>

              {/* Tipo / Categoría */}
              <td>
                <small className="text-capitalize">
                  {p.categoria} ({p.tipo})
                </small>
              </td>

              {/* Precio */}
              <td className="fw-bold">{formatearPrecio(p.precio)}</td>

              {/* Estado: Selector interactivo o Badge de lectura */}
              <td>
                {editableEstado ? (
                  <select
                    className={`form-select form-select-sm rounded-pill fw-semibold border-0 py-1 ps-2 pe-4 ${
                      CLASES_ESTADO[p.estado] || 'bg-secondary text-white'
                    }`}
                    style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                    value={p.estado}
                    onChange={(e) => onCambiarEstado?.(p.id, e.target.value)}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="alquilado">Alquilado</option>
                    <option value="vendido">Vendido</option>
                    <option value="pausado">Pausado</option>
                  </select>
                ) : (
                  <span
                    className={`badge rounded-pill ${
                      CLASES_ESTADO[p.estado] || 'bg-secondary text-white'
                    }`}
                  >
                    {p.estado}
                  </span>
                )}
              </td>

              {/* Acciones */}
              <td className="text-end">
                {onEditar && (
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill px-2 me-1"
                    onClick={() => onEditar(p)}
                  >
                    Editar
                  </button>
                )}
                {onEliminar && (
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-2"
                    onClick={() => onEliminar(p.id, p.titulo)}
                  >
                    {textoBotonEliminar}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
