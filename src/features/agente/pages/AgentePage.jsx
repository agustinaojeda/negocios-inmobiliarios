import { useOutletContext } from 'react-router'

export default function AgentePage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'cartera' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-bold mb-0" style={{ color: '#13284c' }}>
              Cartera de Propiedades Asignadas
            </h2>
            <button className="btn btn-sm btn-primary rounded-pill px-3 fw-medium">
              + Captar Inmueble
            </button>
          </div>
          <p className="text-muted">
            Inmuebles asignados a tu gestión comercial, tasaciones pendientes y estado de publicaciones.
          </p>
        </div>
      )}

      {seccionActiva === 'citas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Agenda de Citas y Visitas
          </h2>
          <p className="text-muted">
            Calendario de visitas guiadas programadas con clientes para esta semana.
          </p>
        </div>
      )}

      {seccionActiva === 'clientes' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Clientes e Interesados
          </h2>
          <p className="text-muted">
            Base de prospectos interesados, búsquedas activas y seguimiento de oportunidades.
          </p>
        </div>
      )}

      {seccionActiva === 'consultas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Consultas y Mensajes
          </h2>
          <p className="text-muted">
            Mensajes directos recibidos desde las fichas públicas de inmuebles.
          </p>
        </div>
      )}

      {seccionActiva === 'perfil' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Mi Perfil Profesional de Agente
          </h2>
          <p className="text-muted">
            Información comercial visible en tus propiedades publicadas.
          </p>
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#f8fafc' }}>
            <p className="mb-1"><strong>Nombre:</strong> {sesion?.nombre || 'Agente Inmobiliario'}</p>
            <p className="mb-1"><strong>Email:</strong> {sesion?.email || 'agente@ejemplo.com'}</p>
            <p className="mb-0"><strong>Rol:</strong> Agente Inmobiliario</p>
          </div>
        </div>
      )}

      {seccionActiva === 'seguridad' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Seguridad
          </h2>
          <p className="text-muted">
            Actualizar contraseña y credenciales de acceso.
          </p>
        </div>
      )}
    </div>
  )
}
