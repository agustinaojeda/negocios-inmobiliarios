// src/features/auth/pages/RegistroPage.jsx
import { useNavigate, Link } from 'react-router'
import FormularioRegistro from '../components/FormularioRegistro'
import { registrarUsuario } from '../services/authService'

export default function RegistroPage() {
    const navigate = useNavigate()

    async function handleRegistro(datosUsuario) {
        await registrarUsuario(datosUsuario)
        // Redirige al login o directamente al panel de inquilino
        navigate('/login')
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Registro de Inquilinos</h2>
                            <FormularioRegistro onRegistroExitoso={handleRegistro} />
                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión aquí</Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}