// src/features/auth/components/FormularioRegistro.jsx
import { useState, useRef } from 'react'
import Boton from '../../../shared/components/Boton'
import { esEmailValido, esRequerido } from '../../../shared/utils/validaciones'

const VALORES_INICIALES = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    rol: 'inquilino',
}

function validar(valores) {
    const errores = {}
    if (!esRequerido(valores.nombre)) {
        errores.nombre = 'El nombre es obligatorio.'
    }
    if (!esRequerido(valores.email)) {
        errores.email = 'El email es obligatorio.'
    } else if (!esEmailValido(valores.email)) {
        errores.email = 'El formato del email no es válido.'
    }
    if (!esRequerido(valores.password)) {
        errores.password = 'La contraseña es obligatoria.'
    } else if (valores.password.length < 6) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres.'
    }
    return errores
}

export default function FormularioRegistro({
    onRegistroExitoso,
    mostrarSelectorRol = false,
    textoBoton = 'Crear mi cuenta',
}) {
    const [valores, setValores] = useState(VALORES_INICIALES)
    const [errores, setErrores] = useState({})
    const [enviando, setEnviando] = useState(false)
    const [mostrarPassword, setMostrarPassword] = useState(false)
    const formularioRef = useRef(null)

    function handleChange(e) {
        const { name, value } = e.target
        setValores((prev) => ({ ...prev, [name]: value }))
        if (errores[name]) {
            setErrores((prev) => ({ ...prev, [name]: undefined }))
        }
        if (errores.global) {
            setErrores((prev) => ({ ...prev, global: undefined }))
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const nuevosErrores = validar(valores)
        setErrores(nuevosErrores)

        const primerError = Object.keys(nuevosErrores)[0]
        if (primerError) {
            formularioRef.current.elements[primerError].focus()
            return
        }

        setEnviando(true)
        try {
            await onRegistroExitoso({
                ...valores,
                nombre: valores.nombre.trim(),
                email: valores.email.trim(),
                telefono: valores.telefono.trim(),
                rol: valores.rol,
            })
        } catch (err) {
            setErrores({ global: err.message || 'Error al registrar el usuario' })
            setEnviando(false)
        }
    }

    return (
        <form ref={formularioRef} onSubmit={handleSubmit} noValidate>
            {errores.global && (
                <div className="alert alert-danger py-2" role="alert">
                    {errores.global}
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                    Nombre completo
                </label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={valores.nombre}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="Ej. Juan Pérez"
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                    value={valores.email}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="nombre@ejemplo.com"
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Contraseña
                </label>
                <div className="input-group has-validation">
                    <input
                        id="password"
                        name="password"
                        type={mostrarPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                        value={valores.password}
                        onChange={handleChange}
                        disabled={enviando}
                        placeholder="Mínimo 6 caracteres"
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

            <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                    Teléfono de contacto <small className="text-secondary">(opcional)</small>
                </label>
                <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    className="form-control"
                    value={valores.telefono}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="Ej. 11 2345 6789"
                />
            </div>

            {mostrarSelectorRol && (
                <div className="mb-4">
                    <label htmlFor="rol" className="form-label">
                        Rol asignado
                    </label>
                    <select
                        id="rol"
                        name="rol"
                        className="form-select"
                        value={valores.rol}
                        onChange={handleChange}
                        disabled={enviando}
                    >
                        <option value="inquilino">Inquilino (Cliente)</option>
                        <option value="propietario">Propietario</option>
                        <option value="agente">Agente Inmobiliario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
            )}

            <Boton type="submit" variante="dark" className="w-100" disabled={enviando}>
                {enviando ? 'Guardando...' : textoBoton}
            </Boton>
        </form>
    )
}