import { useOutletContext } from 'react-router'

export default function AdminPage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'dashboard' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Panel de Control General
          </h2>
          <p className="text-muted">
            Resumen global de actividad, ingresos y operaciones en la plataforma.
          </p>
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <div className="p-3 rounded-4 bg-light border-0">
                <div className="small text-muted mb-1">Usuarios Registrados</div>
                <div className="h4 fw-bold mb-0 text-dark">4</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded-4 bg-light border-0">
                <div className="small text-muted mb-1">Inmuebles Activos</div>
                <div className="h4 fw-bold mb-0 text-dark">12</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded-4 bg-light border-0">
                <div className="small text-muted mb-1">Contratos Vigentes</div>
                <div className="h4 fw-bold mb-0 text-dark">8</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {seccionActiva === 'usuarios' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-bold mb-0" style={{ color: '#13284c' }}>
              Gestión de Usuarios y Roles
            </h2>
            <button className="btn btn-sm btn-primary rounded-pill px-3 fw-medium">
              + Nuevo Usuario
            </button>
          </div>
          <p className="text-muted">
            Administración de cuentas para administradores, agentes, propietarios e inquilinos.
          </p>
        </div>
      )}

      {seccionActiva === 'inmuebles' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Catálogo Global de Inmuebles
          </h2>
          <p className="text-muted">
            Supervisión, aprobación y moderación de publicaciones en el portal.
          </p>
        </div>
      )}

      {seccionActiva === 'contratos' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Contratos y Operaciones
          </h2>
          <p className="text-muted">
            Control de operaciones de venta y contratos de alquiler formalizados.
          </p>
        </div>
      )}

      {seccionActiva === 'reportes' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Reportes y Estadísticas
          </h2>
          <p className="text-muted">
            Métricas de conversión, facturación de comisiones y rendimiento por agente.
          </p>
        </div>
      )}

      {seccionActiva === 'configuracion' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Configuración del Sistema
          </h2>
          <p className="text-muted">
            Parámetros de la plataforma, comisiones y configuración general.
          </p>
          <div className="mt-3 p-3 rounded-3" style={{ backgroundColor: '#f8fafc' }}>
            <p className="mb-1"><strong>Administrador actual:</strong> {sesion?.nombre || 'Admin'}</p>
            <p className="mb-0"><strong>Email:</strong> {sesion?.email || 'admin@ejemplo.com'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
