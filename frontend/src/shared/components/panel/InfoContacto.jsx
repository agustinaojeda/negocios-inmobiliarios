import { useState, useRef } from "react";
import FormInput from "./FormInput";
import {
  obtenerSesion,
  actualizarSesion,
} from "../../../features/auth/services/authService";
import { esRequerido, esEmailValido, esTelefonoValido } from "../../utils/validaciones";

function validar(valores) {
  const errores = {};

  if (!esRequerido(valores.nombre)) {
    errores.nombre = "El nombre es obligatorio.";
  }

  if (!esRequerido(valores.email)) {
    errores.email = "El email es obligatorio.";
  } else if (!esEmailValido(valores.email)) {
    errores.email = "El formato del email no es válido.";
  }

  if (!esRequerido(valores.telefono)) {
    errores.telefono = "El teléfono es obligatorio.";
  } else if (String(valores.telefono).trim().length < 8) {
    errores.telefono = "El teléfono debe tener al menos 8 dígitos.";
  } else if (!esTelefonoValido(valores.telefono)){
    errores.telefono = "El formato del telefono no es válido.";
  }

  return errores;
}

export default function InformacionContacto() {
  const sesionActual = obtenerSesion();

  //genera la foto por defecto
  const avatarDefecto = (nombre) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nombre || "Usuario",
    )}&background=13284c&color=fff`;

  const [formData, setFormData] = useState({
    nombre: sesionActual?.nombre || "",
    email: sesionActual?.email || "",
    telefono: sesionActual?.telefono || "",
    fotoPerfil: sesionActual?.fotoPerfil || avatarDefecto(sesionActual?.nombre),
  });

  const fileInputRef = useRef(null);

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  //convierte la foto a base64 para guardarla
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar los 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, fotoPerfil: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  //quitar la foto actual y restaurar la por defecto
  const handleQuitarFoto = () => {
    const fotoPorDefecto = avatarDefecto(formData.nombre);
    setFormData((prev) => ({ ...prev, fotoPerfil: fotoPorDefecto }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const erroresDetectados = validar(formData);
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    const datosAGuardar = {
      ...formData,
      fotoPerfil: formData.fotoPerfil || avatarDefecto(formData.nombre),
    };

    actualizarSesion(datosAGuardar);
    setErrores({});
    alert("¡Información guardada con éxito!");
  };

  const esFotoPersonalizada =
    formData.fotoPerfil && !formData.fotoPerfil.includes("ui-avatars.com");

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
      <div className="text-center mb-4">
        <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
          Información de contacto
        </h2>
        <p className="text-muted small mb-0">
          Gestioná tus datos personales para mantener al día tus solicitudes.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* SECCION FOTO DE PERFIL */}
        <div className="d-flex flex-column align-items-center text-center gap-3 mb-4 pb-3 border-bottom">
          <img
            src={formData.fotoPerfil || avatarDefecto(formData.nombre)}
            alt="Foto de perfil"
            className="rounded-circle shadow-sm"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div>
            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                onClick={() => fileInputRef.current?.click()}
              >
                Cambiar foto
              </button>

              {/**si la foto es personalizada muestra la opcion de quitarla */}
              {esFotoPersonalizada && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  onClick={handleQuitarFoto}
                >
                  Quitar foto
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFotoChange}
              accept="image/png, image/jpeg, image/webp"
              className="d-none"
            />
            <span className="text-muted d-block small mt-2">
              JPG, PNG o WEBP. Máximo 2MB.
            </span>
          </div>
        </div>

        {/* CAMPOS DEL FORMULARIO */}
        <div className="row g-3">
          <FormInput
            label="Nombre y Apellido"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
            required
            className="col-md-6"
          />

          <FormInput
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            error={errores.email}
            onChange={handleChange}
            required
            className="col-md-6"
          />

          <FormInput
            label="Teléfono / Celular"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={errores.telefono}
            required
            className="col-md-6"
          />

          <div className="col-12 mt-4 text-end">
            <button
              type="submit"
              className="btn text-white rounded-pill px-4 fw-medium shadow-sm"
              style={{ backgroundColor: "#13284c" }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
