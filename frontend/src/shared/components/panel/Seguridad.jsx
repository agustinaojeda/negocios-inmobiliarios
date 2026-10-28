import { useState } from "react";
import FormInput from "./FormInput";
import Alerta from "./Alerta";
import { useAlerta } from "../../hooks/useAlerta";
import { cambiarPassword } from "../../services/usuariosService";
import { esRequerido } from "../../utils/validaciones";

function validar(valores) {
  const errores = {};

  if (!esRequerido(valores.passwordActual)) {
    errores.passwordActual = "La contraseña actual es obligatoria.";
  }

  if (!esRequerido(valores.passwordNueva)) {
    errores.passwordNueva = "La nueva contraseña es obligatoria.";
  } else if (valores.passwordNueva.length < 6) {
    errores.passwordNueva = "La nueva contraseña debe tener al menos 6 caracteres.";
  }

  if (!esRequerido(valores.confirmarPassword)) {
    errores.confirmarPassword = "Debés confirmar la nueva contraseña.";
  } else if (valores.passwordNueva !== valores.confirmarPassword) {
    errores.confirmarPassword = "Las contraseñas no coinciden.";
  }

  return errores;
}

export default function Seguridad() {
  const [formData, setFormData] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const { alerta, mostrarExito, mostrarError, cerrar } = useAlerta();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresDetectados = validar(formData);
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    try {
      setGuardando(true);
      // PATCH /api/usuarios/cambiar-password
      const respuesta = await cambiarPassword(formData.passwordActual, formData.passwordNueva);

      mostrarExito(respuesta?.mensaje || "¡Contraseña actualizada con éxito!");
      setFormData({
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
      });
      setErrores({});
    } catch (err) {
      const mensaje = err.message || "No se pudo actualizar la contraseña.";
      // 400 con contraseña actual incorrecta: se marca también el campo
      if (err.status === 400 && /actual/i.test(mensaje)) {
        setErrores({ passwordActual: mensaje });
      }
      mostrarError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="text-center mb-4">
        <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
          Seguridad
        </h2>
        <p className="text-muted small mb-0">
          Actualizá tu contraseña y gestioná la seguridad de tu cuenta.
        </p>
      </div>

      <Alerta alerta={alerta} onCerrar={cerrar} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <FormInput
            label="Contraseña actual"
            type="password"
            name="passwordActual"
            value={formData.passwordActual}
            onChange={handleChange}
            error={errores.passwordActual}
            required
            className="col-12"
          />

          <FormInput
            label="Nueva contraseña"
            type="password"
            name="passwordNueva"
            value={formData.passwordNueva}
            onChange={handleChange}
            error={errores.passwordNueva}
            required
            className="col-md-6"
          />

          <FormInput
            label="Confirmar nueva contraseña"
            type="password"
            name="confirmarPassword"
            value={formData.confirmarPassword}
            onChange={handleChange}
            error={errores.confirmarPassword}
            required
            className="col-md-6"
          />

          <div className="col-12 mt-4 text-end">
            <button
              type="submit"
              id="btn-actualizar-password"
              disabled={guardando}
              className="btn text-white rounded-pill px-4 fw-medium shadow-sm"
              style={{ backgroundColor: "#13284c" }}
            >
              {guardando ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}