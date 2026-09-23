import { useState } from "react";
import { registrarUsuario } from "../../auth";
import { esEmailValido, esRequerido } from "../../../shared/utils/validaciones";

export default function ModalCrearUsuario({ mostrar, onCerrar, onUsuarioCreado }) {
  const [valores, setValores] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    rol: "inquilino",
  });

  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!mostrar) return null;

  function validar() {
    const nuevosErrores = {};

    if (!esRequerido(valores.nombre)) {
      nuevosErrores.nombre = "El nombre y apellido es obligatorio.";
    }

    if (!esRequerido(valores.email)) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (!esEmailValido(valores.email)) {
      nuevosErrores.email = "El formato de correo no es válido.";
    }

    if (!esRequerido(valores.password)) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (valores.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return nuevosErrores;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorServidor("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorServidor("");

    const fallas = validar();
    if (Object.keys(fallas).length > 0) {
      setErrores(fallas);
      return;
    }

    setEnviando(true);
    try {
      const nuevoUsuario = await registrarUsuario({
        nombre: valores.nombre,
        email: valores.email,
        password: valores.password,
        telefono: valores.telefono,
        rol: valores.rol,
      });

      // Limpiar formulario y notificar
      setValores({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        rol: "inquilino",
      });
      setErrores({});
      onUsuarioCreado(nuevoUsuario);
      onCerrar();
    } catch (err) {
      setErrorServidor(err.message || "Ocurrió un error al registrar el usuario.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light border-0 px-4 pt-4 pb-2">
            <div>
              <h5 className="modal-title fw-bold" style={{ color: "#13284c" }}>
                Crear Nuevo Usuario
              </h5>
              <p className="text-muted small mb-0">
                Completa los datos y asigna el rol correspondiente.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onCerrar}
              disabled={enviando}
            ></button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body px-4 py-3">
              {errorServidor && (
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                  {errorServidor}
                </div>
              )}

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nombre y Apellido</label>
                <input
                  type="text"
                  name="nombre"
                  value={valores.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Laura González"
                  className={`form-control rounded-3 ${errores.nombre ? "is-invalid" : ""}`}
                  disabled={enviando}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={valores.email}
                  onChange={handleChange}
                  placeholder="ejemplo@inmobiliaria.com"
                  className={`form-control rounded-3 ${errores.email ? "is-invalid" : ""}`}
                  disabled={enviando}
                />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Contraseña Inicial</label>
                <input
                  type="password"
                  name="password"
                  value={valores.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className={`form-control rounded-3 ${errores.password ? "is-invalid" : ""}`}
                  disabled={enviando}
                />
                {errores.password && <div className="invalid-feedback">{errores.password}</div>}
              </div>

              {/* Teléfono */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Teléfono <span className="text-muted fw-normal">(Opcional)</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={valores.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 11 3456 7890"
                  className="form-control rounded-3"
                  disabled={enviando}
                />
              </div>

              {/* Rol */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Rol Asignado</label>
                <select
                  name="rol"
                  value={valores.rol}
                  onChange={handleChange}
                  className="form-select rounded-3"
                  disabled={enviando}
                >
                  <option value="inquilino">Inquilino (Cliente / Búsquedas)</option>
                  <option value="propietario">Propietario (Dueño de Inmuebles)</option>
                  <option value="agente">Agente Inmobiliario (Gestión Comercial)</option>
                  <option value="admin">Administrador (Acceso Total)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light border-0 px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onCerrar}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-semibold"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Guardando...
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
