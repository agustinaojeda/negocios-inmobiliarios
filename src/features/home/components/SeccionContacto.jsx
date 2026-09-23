import InfoContacto from "./InfoContacto";
import FormularioContacto from "./FormularioContacto";
import "./SeccionContacto.css";

export default function SeccionContacto() {
  return (
    <section className="contact-section" id="contacto" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-grid">
          <InfoContacto />
          <FormularioContacto />
        </div>
      </div>
    </section>
  );
}
