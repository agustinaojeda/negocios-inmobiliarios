import { formatearPrecio } from '../../utils/formato'

function claseBadgeTipo(tipo) {
  if (tipo === 'venta') {
    return 'bg-success-subtle text-success border border-success-subtle'
  }
  if (tipo === 'alquiler') {
    return 'bg-primary-subtle text-primary border border-primary-subtle'
  }
  return 'bg-secondary-subtle text-secondary border border-secondary-subtle'
}

function nombreCompleto(nombre, apellido) {
  return [nombre, apellido].filter(Boolean).join(' ')
}

function formatearMonto(monto, moneda) {
  const monedaNormalizada = String(moneda || 'USD').toUpperCase()
  return formatearPrecio(Number(monto || 0), monedaNormalizada)
}

export default function TablaOperaciones({ operaciones = [], onVerDetalle }) {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light small text-muted text-uppercase">
          <tr>
            <th scope="col" className="border-0">Fecha</th>
            <th scope="col" className="border-0">Tipo</th>
            <th scope="col" className="border-0">Inmueble</th>
            <th scope="col" className="border-0">Cliente</th>
            <th scope="col" className="border-0">Agente</th>
            <th scope="col" className="border-0 text-end">Monto</th>
            <th scope="col" className="border-0 text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {operaciones.map((op) => {
            const tipo = op.tipo_operacion ? op.tipo_operacion.toLowerCase() : 'venta'
            const nombreCliente = nombreCompleto(op.cliente_nombre, op.cliente_apellido)
            const nombreAgente = nombreCompleto(op.agente_nombre, op.agente_apellido)

            return (
              <tr key={op.id}>
                <td className="small text-muted">
                  {op.fecha_operacion ? String(op.fecha_operacion).split('T')[0] : 'N/D'}
                </td>
                <td>
                  <span className={`badge rounded-pill ${claseBadgeTipo(tipo)}`}>
                    {tipo.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="fw-semibold text-dark small">
                    {op.propiedad_titulo || `Inmueble #${op.propiedad_id}`}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {op.propiedad_zona || ''}
                  </div>
                </td>
                <td className="small text-secondary">
                  {nombreCliente || (op.cliente_id ? `Cliente #${op.cliente_id}` : 'Sin cliente')}
                </td>
                <td className="small text-secondary">
                  {nombreAgente || (op.agente_id ? `Agente #${op.agente_id}` : 'Sin agente asignado')}
                </td>
                <td className="fw-bold small text-end text-dark">
                  {formatearMonto(op.monto_cierre, op.moneda)}
                </td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    onClick={() => onVerDetalle && onVerDetalle(op.id)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
