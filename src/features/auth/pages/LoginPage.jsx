import { useNavigate, useLocation, Link } from 'react-router'
import FormularioLogin from '../components/FormularioLogin'
import { iniciarSesion, obtenerRutaPorRol } from '../services/authService'
import Tarjeta from '../../../shared/components/Tarjeta'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const registroExitoso = location.state?.registroExitoso

  async function handleIngresar({ email, password }) {
    const sesion = await iniciarSesion(email, password)
    navigate(obtenerRutaPorRol(sesion.rol), { replace: true })
  }

  return (
    <section className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          {registroExitoso && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              ¡Cuenta creada con éxito! Ya podés ingresar con tus credenciales.
            </div>
          )}

          <Tarjeta titulo="Iniciar sesión">
            <FormularioLogin onIngresar={handleIngresar} />
            <div className="text-center mt-3 pt-2 border-top">
              <small className="text-secondary">
                ¿No tenés una cuenta?{' '}
                <Link to="/registro" className="fw-semibold text-decoration-none">
                  Registrate aquí
                </Link>
              </small>
            </div>
          </Tarjeta>
        </div>
      </div>
    </section>
  )
}

export default LoginPage