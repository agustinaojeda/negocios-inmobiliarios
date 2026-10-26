import { useOutletContext } from 'react-router'
import GestionUsuarios from '../components/GestionUsuarios'
import GestionInmuebles from '../components/GestionInmuebles'
import { useFetch } from '../../../shared/hooks/useFetch'
import { listarUsuarios } from '../../../shared/services/usuariosService'

// Tarjeta con la cantidad real de usuarios (GET /api/usuarios)
function TarjetaUsuarios() {
  const { datos: usuarios, cargando, error } = useFetch(listarUsuarios)
  const total = usuarios?.length ?? 0
  const activos = usuarios?.filter((u) => u.estaActivo).length ?? 0

  return (
    <div className="p-3 rounded-4 bg-light border-0">
      <div className="small text-muted mb-1">Usuarios Registrados</div>
      {cargando ? (
        <div className="spinner-border spinner-border-sm text-secondary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      ) : error ? (
        <div className="small text-danger">No disponible</div>
      ) : (
        <>
          <div className="h4 fw-bold mb-0 text-dark">{total}</div>
          <div className="small text-muted">{activos} activos</div>
        </>
      )}
    </div>
  )
}

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
              <TarjetaUsuarios />
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

      {seccionActiva === 'usuarios' && (<GestionUsuarios />)}

      {seccionActiva === 'inmuebles' && (<GestionInmuebles />)}

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
