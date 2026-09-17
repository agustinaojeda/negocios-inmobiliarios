import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
{
    path: '/',
    element: <LayoutPublico />,
    errorElement: <NoEncontradaPage />,
    children: [
      { index: true, element: <HomePage /> }, // "/" exacto
      { path: 'catalogo', element: <CatalogoPage /> }, // "/catalogo"
      { path: 'catalogo/:id', element: <DetalleProductoPage /> }, // ":id" es un parámetro
      { path: 'carrito', element: <CarritoPage /> },
      { path: 'contacto', element: <ContactoPage /> },
      {
        path: 'login',
        element: <LoginPage />,
        loader: redirigirSiHaySesion, // si ya hay sesión, va directo al gestor
        hydrateFallbackElement: <Spinner />,
      },
      { path: '*', element: <NoEncontradaPage /> }, // cualquier otra URL
    ],
  },

])