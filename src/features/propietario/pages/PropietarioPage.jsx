import { useOutletContext } from 'react-router'
import InformacionContacto from '../../../shared/components/panel/InfoContacto'
import Seguridad from '../../../shared/components/panel/Seguridad'

export default function PropietarioPage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'propiedades' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-bold mb-0" style={{ color: '#13284c' }}>
              Mis Propiedades
            </h2>
            <button className="btn btn-sm btn-primary rounded-pill px-3 fw-medium">
              + Publicar Nueva Propiedad
            </button>
          </div>
          <p className="text-muted">
            Gestiona tu cartera de inmuebles, estados de publicación y solicitudes de alquiler o venta.
          </p>
        </div>
      )}

      {seccionActiva === 'contratos' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Contratos y Alquileres
          </h2>
          <p className="text-muted">
            Consulta el estado de los contratos de locación, fechas de vencimiento y datos de los inquilinos.
          </p>
        </div>
      )}

      {seccionActiva === 'liquidaciones' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Liquidaciones y Pagos
          </h2>
          <p className="text-muted">
            Historial de transferencias, cobros de alquileres y comprobantes de liquidación mensual.
          </p>
        </div>
      )}

      {seccionActiva === 'visitas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Visitas y Citas
          </h2>
          <p className="text-muted">
            Solicitudes de visita programadas por potenciales interesados para tus propiedades.
          </p>
        </div>
      )}

      {seccionActiva === 'contacto' && (<InformacionContacto />
      )}

      {seccionActiva === 'seguridad' && (<Seguridad />
      )}
    </div>
  )
}
