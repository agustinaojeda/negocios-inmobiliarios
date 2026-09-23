import { useState } from "react";
import { useOutletContext } from "react-router";
import { esRequerido, esEmailValido } from "../../../shared/utils/validaciones";
import "./FormularioContacto.css";


const DATOS_INICIALES = {
  nombre: "",
  email: "",
  tel: "",
  preferencia: "whatsapp",
  buscando: "alquilar",
  ubicacion: "",
  dormitorios: "2",
  banos: "1",
  cochera: "no",
  presupuesto: "",
};

// implementa validaciones.js

function validar(datos) {
  const errores = {};
  if (!esRequerido(datos.nombre)) errores.nombre = true;
  if (!esRequerido(datos.email) || !esEmailValido(datos.email)) errores.email = true;
  if (!esRequerido(datos.tel)) errores.tel = true;
  if (!esRequerido(datos.ubicacion)) errores.ubicacion = true;
  if (datos.buscando === "alquilar" && !esRequerido(datos.presupuesto)) {
    errores.presupuesto = true;
  }
  return errores;
}

export default function FormularioContacto() {
  const { mostrarToast } = useOutletContext();
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const buscandoAlquilar = datos.buscando === "alquilar";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };


  // se simula el envío como hacía el setTimeout del main.js.
  const handleSubmit = (event) => {
    event.preventDefault();

    const erroresEncontrados = validar(datos);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      mostrarToast("✗ Por favor completa los campos requeridos.");
      return;
    }

    setEnviado(true);
    mostrarToast("✓ Consulta recibida. Un asesor te contactará a la brevedad.");

    setTimeout(() => {
      setEnviado(false);
      setDatos(DATOS_INICIALES);
      setErrores({});
    }, 3500);
  };

  
  const clase = (campo) => (errores[campo] ? "campo-error" : "");

  return (
    <div className="contact-form-wrap">
      <form className="contact-main-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cNombre">Nombre y Apellido</label>
            <input
              type="text"
              id="cNombre"
              name="nombre"
              placeholder="Ej. Juan Pérez"
              value={datos.nombre}
              onChange={handleChange}
              className={clase("nombre")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cEmail">Email</label>
            <input
              type="email"
              id="cEmail"
              name="email"
              placeholder="ejemplo@gmail.com"
              value={datos.email}
              onChange={handleChange}
              className={clase("email")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cTel">Teléfono / WhatsApp</label>
            <input
              type="tel"
              id="cTel"
              name="tel"
              placeholder="Ej. +54 11 1234-5678"
              value={datos.tel}
              onChange={handleChange}
              className={clase("tel")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cPref">Preferencia de contacto</label>
            <select id="cPref" name="preferencia" value={datos.preferencia} onChange={handleChange}>
              <option value="whatsapp">WhatsApp</option>
              <option value="llamada">Llamada telefónica</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cBuscando">¿Qué estás buscando?</label>
            <select id="cBuscando" name="buscando" value={datos.buscando} onChange={handleChange}>
              <option value="comprar">Comprar</option>
              <option value="alquilar">Alquilar</option>
              <option value="vender">Vender</option>
              <option value="ofrecer">Ofrecer una propiedad</option>
              <option value="tasar">Tasar una propiedad</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cUbicacion">Ubicación o zona de interés</label>
            <input
              type="text"
              id="cUbicacion"
              name="ubicacion"
              placeholder="Ej. Palermo, Belgrano, Tigre…"
              value={datos.ubicacion}
              onChange={handleChange}
              className={clase("ubicacion")}
            />
          </div>

          <div className="form-group half">
            <label htmlFor="cDormitorios">Dormitorios</label>
            <select id="cDormitorios" name="dormitorios" value={datos.dormitorios} onChange={handleChange}>
              <option value="monoambiente">Monoambiente</option>
              <option value="1">1 Dormitorio</option>
              <option value="2">2 Dormitorios</option>
              <option value="3">3 Dormitorios</option>
              <option value="4+">4 o más</option>
            </select>
          </div>

          <div className="form-group half">
            <label htmlFor="cBanos">Baños</label>
            <select id="cBanos" name="banos" value={datos.banos} onChange={handleChange}>
              <option value="1">1 Baño</option>
              <option value="2">2 Baños</option>
              <option value="3+">3 o más</option>
            </select>
          </div>

          <div className="form-group half">
            <label htmlFor="cCochera">Cochera</label>
            <select id="cCochera" name="cochera" value={datos.cochera} onChange={handleChange}>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          
          {buscandoAlquilar && (
            <div className="form-group half">
              <label htmlFor="cPresupuesto">Presupuesto mensual máx (USD)</label>
              <input
                type="number"
                id="cPresupuesto"
                name="presupuesto"
                placeholder="Ej. 1500"
                min="10"
                value={datos.presupuesto}
                onChange={handleChange}
                className={clase("presupuesto")}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={enviado}>
          {enviado ? " ¡Consulta enviada!" : "Enviar Consulta"}
        </button>
      </form>
    </div>
  );
}
