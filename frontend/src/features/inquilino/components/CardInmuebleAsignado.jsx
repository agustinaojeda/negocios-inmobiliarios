import { formatearPrecio } from '../../../shared/utils/formato'
import { resolverUrlImagen } from '../../../shared/config/api'

function formatearFechaLocal(fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${fecha.getFullYear()}`
}

function formatearFecha(fecha) {
  if (!fecha) return null

  if (fecha instanceof Date) {
    return Number.isNaN(fecha.getTime()) ? null : formatearFechaLocal(fecha)
  }

  const texto = String(fecha)

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [anio, mes, dia] = texto.split('-')
    return `${dia}/${mes}/${anio}`
  }

  const fechaObjeto = new Date(texto)
  return Number.isNaN(fechaObjeto.getTime())
    ? null
    : formatearFechaLocal(fechaObjeto)
}

export default function CardInmuebleAsignado({ inmueble }) {
  if (!inmueble) return null

  const esAlquiler = inmueble.tipo === 'alquiler'
  const imagen = resolverUrlImagen(inmueble.img) || '/img/propiedades/prop1.jpg'
  const fechaOperacion = formatearFecha(inmueble.fechaOperacion)
  const inicioContrato = formatearFecha(inmueble.fechaInicioContrato)
  const finContrato = formatearFecha(inmueble.fechaFinContrato)

  return (
    <article className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
      <div className="position-relative">
        <img
          src={imagen}
          alt={inmueble.titulo}
          loading="lazy"
          className="w-100 object-fit-cover"
          style={{ height: '170px' }}
          onError={(evento) => {
            evento.target.src = '/img/propiedades/prop1.jpg'
          }}
        />
        <span
          className={`badge rounded-pill position-absolute top-0 end-0 m-3 px-3 py-2 fw-semibold ${
            esAlquiler ? 'bg-primary text-white' : 'bg-success text-white'
          }`}
        >
          {esAlquiler ? 'En alquiler' : 'Comprada'}
        </span>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <h3 className="h6 fw-bold mb-1" style={{ color: '#13284c' }}>
          {inmueble.titulo}
        </h3>

        <p className="small text-muted mb-1">
          {[inmueble.zona, inmueble.direccion].filter(Boolean).join(' • ') || 'Ubicación no especificada'}
        </p>

        {inmueble.categoria && (
          <p className="small text-secondary mb-2 text-capitalize">{inmueble.categoria}</p>
        )}

        <div className="rounded-3 px-3 py-2 mb-3" style={{ backgroundColor: '#f1f4f9' }}>
          <div className="small text-muted mb-1">Monto de cierre</div>
          <div className="fw-bold" style={{ color: '#13284c' }}>
            {formatearPrecio(inmueble.precio, inmueble.moneda || 'USD')}
          </div>
        </div>

        <ul className="list-unstyled small text-secondary mb-0 mt-auto">
          {fechaOperacion && (
            <li className="mb-1">
              Operación cerrada: <strong>{fechaOperacion}</strong>
            </li>
          )}
          {esAlquiler && inicioContrato && (
            <li className="mb-1">
              Contrato: <strong>{inicioContrato}</strong>
              {finContrato ? ` al ${finContrato}` : ''}
            </li>
          )}
          <li className="mb-1">
            Asesor: <strong>{inmueble.agenteNombre || 'Sin asesor asignado'}</strong>
          </li>
          {inmueble.clienteNombre && (
            <li>
              Cliente: <strong>{inmueble.clienteNombre}</strong>
            </li>
          )}
        </ul>
      </div>
    </article>
  )
}
