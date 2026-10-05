import { createBrowserRouter, redirect } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import LayoutPrivado from './shared/layout/LayoutPrivado'
import HomePage from './features/home/pages/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import RegistroPage from './features/auth/pages/RegistroPage'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import Spinner from './shared/components/Spinner'
import { redirigirSiHaySesion, protegerRuta, obtenerSesion } from './features/auth/services/authService'
import PropietarioPage from './features/propietario/pages/PropietarioPage'
import InquilinoPage from './features/inquilino/pages/InquilinoPage'
import AgentePage from './features/agente/pages/AgentePage'
import AdminPage from './features/admin/pages/AdminPage'
import InmueblesPage from './features/inmuebles/pages/InmueblesPage'
import DetalleInmueblesPage from './features/inmuebles/pages/DetalleInmueblesPage'
import NoAutorizado from './shared/pages/NoAutorizado'


export const router = createBrowserRouter([
  // Rutas públicas con LayoutPublico
  {
    path: '/',
    element: <LayoutPublico />,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'login',
        element: <LoginPage />,
        loader: redirigirSiHaySesion,
        hydrateFallbackElement: <Spinner />,
      },
      {
        path: 'registro',
        element: <RegistroPage />,
        loader: redirigirSiHaySesion,
        hydrateFallbackElement: <Spinner />,
      },
      { path: 'inmuebles', element: <InmueblesPage /> },
      { path: 'inmueble/:id', element: <DetalleInmueblesPage /> },
    ],
  },

  // Rutas privadas con LayoutPrivado y Sidebar integrado
  {
    element: <LayoutPrivado />,
    errorElement: <NoEncontradaPage />,
    loader: protegerRuta,
    hydrateFallbackElement: <Spinner />,
    children: [
      {
        path: 'inquilino',
        element: <InquilinoPage />,
        loader: inquilinoLoader,
      },
      {
        path: 'propietario',
        element: <PropietarioPage />,
        loader: propietarioLoader,
      },
      {
        path: 'agente',
        element: <AgentePage />,
        loader: agenteLoader,
      },
      {
        path: 'admin',
        element: <AdminPage />,
        loader: adminLoader,
      },
    ],
  },

  // Ruta no autorizada
  { path: '/noautorizado', element: <NoAutorizado /> },

  // Ruta 404
  { path: '*', element: <NoEncontradaPage /> },
])

// Loaders por rol para verificar permisos antes de renderizar la página
async function adminLoader() {
  const user = obtenerSesion()
  if (user?.rol !== 'admin') {
    throw redirect('/noautorizado')
  }
  return user
}

async function agenteLoader() {
  const user = obtenerSesion()
  if (user?.rol !== 'agente') {
    throw redirect('/noautorizado')
  }
  return user
}

async function propietarioLoader() {
  const user = obtenerSesion()
  if (user?.rol !== 'propietario') {
    throw redirect('/noautorizado')
  }
  return user
}

async function inquilinoLoader() {
  const user = obtenerSesion()
  if (user?.rol !== 'inquilino') {
    throw redirect('/noautorizado')
  }
  return user
}