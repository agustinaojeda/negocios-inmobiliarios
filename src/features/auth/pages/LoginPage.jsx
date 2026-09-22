import { useNavigate } from 'react-router'
import FormularioLogin from '../components/FormularioLogin'
import { iniciarSesion } from '../services/authService'
import Tarjeta from '../../../shared/components/Tarjeta'

function LoginPage() {
  const navigate = useNavigate()

  async function handleIngresar({ email, password }) {
    await iniciarSesion(email, password) // si falla, lanza un error que muestra el formulario
    navigate('/gestor', { replace: true })
  }

  return (
    <section className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Tarjeta titulo="Iniciar sesión">
            <FormularioLogin onIngresar={handleIngresar} />
          </Tarjeta>
        </div>
      </div>
    </section>
  )
}

export default LoginPage