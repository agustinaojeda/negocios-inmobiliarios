import { useRef, useState } from 'react'
import Boton from '../../../shared/components/Boton'
import { esEmailValido, esRequerido } from '../../../shared/utils/validaciones'

function validar(valores) {
    const errores = {}
    if (!esRequerido(valores.email)) errores.email = 'Ingresá tu email.'
    else if (!esEmailValido(valores.email)) errores.email = 'El formato del email no es válido.'
    if (!esRequerido(valores.password)) errores.password = 'Ingresá tu contraseña.'
    return errores
}

// El formulario solo junta y valida datos. Qué pasa al ingresar lo decide
// la página que lo usa, a través de la prop onIngresar.
function FormularioLogin({ onIngresar }) {
    const [valores, setValores] = useState({ email: '', password: '' })
    const [errores, setErrores] = useState({})
    const [errorServidor, setErrorServidor] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const formularioRef = useRef(null)

    function handleChange(e) {
        const { name, value } = e.target
        setValores({ ...valores, [name]: value })
        if (errores[name]) setErrores({ ...errores, [name]: undefined })
        setErrorServidor('')
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const nuevosErrores = validar(valores)
        setErrores(nuevosErrores)

        const primerCampoConError = Object.keys(nuevosErrores)[0]
        if (primerCampoConError) {
            formularioRef.current.elements[primerCampoConError].focus()
            return
        }

        setEnviando(true)
        try {
            await onIngresar(valores) // si sale bien, la página navega y este componente se desmonta
        } catch (error) {
            setErrorServidor(error.message)
            setEnviando(false)
        }
    }

    return (
        <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
            {errorServidor && (
                <div className="alert alert-danger py-2" role="alert">
                    {errorServidor}
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                    value={valores.email}
                    onChange={handleChange}
                    disabled={enviando}
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="form-label">
                    Contraseña
                </label>
                <div className="input-group has-validation">
                    <input
                        id="password"
                        name="password"
                        type={mostrarPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                        value={valores.password}
                        onChange={handleChange}
                        disabled={enviando}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        aria-pressed={mostrarPassword}
                    >
                        {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                    {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                </div>
            </div>

            <Boton type="submit" variante="dark" className="w-100" disabled={enviando}>
                {enviando ? 'Verificando...' : 'Ingresar'}
            </Boton>
        </form>
    )
}

export default FormularioLogin