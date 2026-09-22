import { createBrowserRouter } from 'react-router'
import LayoutPublico from './shared/layout/LayoutPublico'
import HomePage from './features/home/pages/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import RegistroPage from './features/auth/pages/RegistroPage'
import NoEncontradaPage from './shared/pages/NoEncontradaPage'
import Spinner from './shared/components/Spinner'
import { redirigirSiHaySesion, protegerRuta } from './features/auth/services/authService'
import PropietarioPage from './features/propietario/pages/PropietarioPage'
import InquilinoPage from './features/inquilino/pages/InquilinoPage'
import AdminPage from './features/admin/pages/AdminPage'
import InmueblesPage from './features/inmuebles/pages/InmueblesPage'

export const router = createBrowserRouter([
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
      { path: 'propietario', element: <PropietarioPage />, loader: protegerRuta },
      { path: 'inquilino', element: <InquilinoPage />, loader: protegerRuta },
      { path: 'admin', element: <AdminPage />, loader: protegerRuta },
      { path: '*', element: <NoEncontradaPage /> },
    ],
  },
])