import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { cerrarSesion } from '../../auth/services/authService'

export default function InquilinoPage() {
  const [seccionActiva, setSeccionActiva] = useState('contacto')

  const handleCerrarSesion = () => {
    cerrarSesion()
    window.location.href = '/login'
  }

  return (
    <div style={{ backgroundColor: '#f0efe9' }} className="min-vh-100 py-5">
      <div className="container mt-5">
        <div className="row g-4">
          
          <Sidebar
            seccionActiva={seccionActiva}
            onSeleccionar={setSeccionActiva}
            onCerrarSesion={handleCerrarSesion}
          />

          <section className="col-lg-9" style={{ paddingTop: '0' }}>
            {seccionActiva === 'contacto' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>Información de Contacto</h2>
                <p className="text-muted">Acá va la vista de datos personales.</p>
              </div>
            )}

            {seccionActiva === 'favoritos' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>Mis Favoritos</h2>
                <p className="text-muted">Acá va la grilla de propiedades favoritas.</p>
              </div>
            )}

            {seccionActiva === 'citas' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>Mis Citas</h2>
              </div>
            )}

            {seccionActiva === 'alertas' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>Alertas de precio</h2>
              </div>
            )}

            {seccionActiva === 'asignados' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>Inmuebles Asignados</h2>
              </div>
            )}

            {seccionActiva === 'seguridad' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>Seguridad</h2>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}