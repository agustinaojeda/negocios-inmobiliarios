import { useOutletContext } from 'react-router'

export default function InquilinoPage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'contacto' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Información de Contacto
          </h2>
          <p className="text-muted">
            Gestiona tus datos personales y medios de contacto.
          </p>
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#f8fafc' }}>
            <p className="mb-1"><strong>Nombre:</strong> {sesion?.nombre || 'Inquilino'}</p>
            <p className="mb-1"><strong>Email:</strong> {sesion?.email || 'inquilino@ejemplo.com'}</p>
            <p className="mb-0"><strong>Rol:</strong> Inquilino</p>
          </div>
        </div>
      )}

      {seccionActiva === 'favoritos' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Mis Favoritos
          </h2>
          <p className="text-muted">Propiedades que has guardado como favoritas para consultar más tarde.</p>
        </div>
      )}

      {seccionActiva === 'citas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Mis Citas
          </h2>
          <p className="text-muted">Visualiza y coordina tus visitas programadas a propiedades.</p>
        </div>
      )}

      {seccionActiva === 'alertas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Alertas de Precio
          </h2>
          <p className="text-muted">Notificaciones automáticas sobre cambios de precio en inmuebles de tu interés.</p>
        </div>
      )}

      {seccionActiva === 'asignados' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Inmuebles Asignados
          </h2>
          <p className="text-muted">Contratos y propiedades donde eres inquilino actualmente.</p>
        </div>
      )}

      {seccionActiva === 'seguridad' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Seguridad
          </h2>
          <p className="text-muted">Actualiza tu contraseña y gestiona la seguridad de tu cuenta.</p>
        </div>
      )}
    </div>
  )
}