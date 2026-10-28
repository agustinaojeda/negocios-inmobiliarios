import { useState, useRef, useMemo, useEffect } from "react";
import FormInput from "./FormInput";
import Alerta from "./Alerta";
import Spinner from "../Spinner";
import MensajeVacio from "../MensajeVacio";
import { useFetch } from "../../hooks/useFetch";
import { useAlerta } from "../../hooks/useAlerta";
import { obtenerMiPerfil, actualizarMiPerfil } from "../../services/usuariosService";
import { resolverUrlImagen } from "../../config/api";
import { esRequerido, esTelefonoValido } from "../../utils/validaciones";

const TAMANO_MAXIMO_FOTO = 5 * 1024 * 1024; // mismo límite que el backend (multer)

function validar(valores) {
  const errores = {};

  if (!esRequerido(valores.nombre)) {
    errores.nombre = "El nombre es obligatorio.";
  }

  if (!esRequerido(valores.apellido)) {
    errores.apellido = "El apellido es obligatorio.";
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

//genera la foto por defecto
const avatarDefecto = (nombre) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    nombre || "Usuario",
  )}&background=13284c&color=fff`;

// Carga el perfil real desde GET /api/usuarios/perfil y recién ahí muestra el formulario
export default function InformacionContacto() {
  const { datos: perfil, cargando, error } = useFetch(obtenerMiPerfil);

  if (cargando) return <Spinner texto="Cargando tu información..." />;
  if (error) {
    return (
      <MensajeVacio titulo="No pudimos cargar tu información" texto={error.message} />
    );
  }

  return <FormularioContacto perfil={perfil} />;
}

function FormularioContacto({ perfil }) {
  const [formData, setFormData] = useState({
    nombre: perfil?.nombre || "",
    apellido: perfil?.apellido || "",
    email: perfil?.email || "",
    telefono: perfil?.telefono || "",
  });
  const [fotoGuardada, setFotoGuardada] = useState(perfil?.fotoPerfil || null);
  const [fotoNueva, setFotoNueva] = useState(null); // File elegido y todavía no guardado
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const { alerta, mostrarExito, mostrarError, cerrar } = useAlerta();

  const fileInputRef = useRef(null);

  // Vista previa local de la foto elegida (se libera al cambiarla o desmontar)
  const previewUrl = useMemo(
    () => (fotoNueva ? URL.createObjectURL(fotoNueva) : null),
    [fotoNueva],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      mostrarError("El archivo seleccionado no es una imagen.");
      return;
    }
    if (file.size > TAMANO_MAXIMO_FOTO) {
      mostrarError("La imagen no debe superar los 5MB.");
      return;
    }
    setFotoNueva(file);
  };

  //descarta la foto elegida y vuelve a la guardada
  const handleQuitarFoto = () => {
    setFotoNueva(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      const usuario = await actualizarMiPerfil({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        foto: fotoNueva,
      });

      setFormData((prev) => ({
        ...prev,
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        telefono: usuario.telefono || "",
      }));
      setFotoGuardada(usuario.fotoPerfil || null);
      setFotoNueva(null);
      setErrores({});
      mostrarExito("¡Información guardada con éxito!");
    } catch (err) {
      mostrarError(err.message || "No se pudo guardar la información.");
    } finally {
      setGuardando(false);
    }
  };

  const fotoMostrada =
    previewUrl ||
    resolverUrlImagen(fotoGuardada) ||
    avatarDefecto(`${formData.nombre} ${formData.apellido}`.trim());

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

      <Alerta alerta={alerta} onCerrar={cerrar} />

      <form onSubmit={handleSubmit} noValidate>
        {/* SECCION FOTO DE PERFIL */}
        <div className="d-flex flex-column align-items-center text-center gap-3 mb-4 pb-3 border-bottom">
          <img
            src={fotoMostrada}
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
                id="btn-cambiar-foto"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={guardando}
              >
                Cambiar foto
              </button>

              {/**si hay una foto elegida sin guardar muestra la opcion de descartarla */}
              {fotoNueva && (
                <button
                  type="button"
                  id="btn-quitar-foto"
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  onClick={handleQuitarFoto}
                  disabled={guardando}
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
              {fotoNueva
                ? "Guardá los cambios para aplicar la nueva foto."
                : "JPG, PNG o WEBP. Máximo 5MB."}
            </span>
          </div>
        </div>

        {/* CAMPOS DEL FORMULARIO */}
        <div className="row g-3">
          <FormInput
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errores.nombre}
            required
            className="col-md-6"
          />

          <FormInput
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            error={errores.apellido}
            required
            className="col-md-6"
          />

          <FormInput
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            disabled
            hint="El correo electrónico no se puede modificar."
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
              id="btn-guardar-contacto"
              disabled={guardando}
              className="btn text-white rounded-pill px-4 fw-medium shadow-sm"
              style={{ backgroundColor: "#13284c" }}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
