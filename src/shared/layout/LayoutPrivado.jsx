import { useState, useEffect } from 'react'
import { Outlet, useLoaderData, useNavigate, useLocation, ScrollRestoration } from 'react-router'
import NavbarPrivado from './NavbarPrivado'
import Sidebar from '../components/Sidebar'
import { MENUS_POR_ROL } from '../config/sidebarMenuConfig'
import { cerrarSesion } from '../../features/auth/services/authService'

export default function LayoutPrivado() {
  const sesion = useLoaderData()
  const navigate = useNavigate()
  const location = useLocation()

  // Determinar el rol actual según la sesión o ruta
  const rol = sesion?.rol || 'inquilino'
  const menuConfig = MENUS_POR_ROL[rol] || MENUS_POR_ROL.inquilino

  const [seccionActiva, setSeccionActiva] = useState(menuConfig.seccionInicial)

  // Sincronizar sección inicial si cambia de rol o ruta
  useEffect(() => {
    setSeccionActiva(menuConfig.seccionInicial)
  }, [rol, location.pathname])

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <>
      <NavbarPrivado sesion={sesion} />

      <div style={{ backgroundColor: '#f0efe9' }} className="min-vh-100 py-4">
        <div className="container mt-2">
          <div className="row g-4">
            <Sidebar
              titulo={menuConfig.titulo}
              grupos={menuConfig.grupos}
              seccionActiva={seccionActiva}
              onSeleccionar={setSeccionActiva}
              onCerrarSesion={handleCerrarSesion}
            />

            <main className="col-lg-9" style={{ paddingTop: '0' }}>
              <Outlet context={{ sesion, seccionActiva, setSeccionActiva }} />
            </main>
          </div>
        </div>
      </div>

      <ScrollRestoration />
    </>
  )
}
