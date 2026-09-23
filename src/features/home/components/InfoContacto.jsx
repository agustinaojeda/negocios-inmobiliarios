import "./InfoContacto.css";


const TELEFONO = "+541100000000";
const TELEFONO_VISIBLE = "+54 11 0000-0000";
const MENSAJE_WHATSAPP = "Hola, me interesa consultar sobre una propiedad.";

export default function InfoContacto() {
  return (
    <div className="contact-info">
      <span className="section-tag">Contacto</span>

      <h2 className="section-title" id="contact-title">
        ¿Listo/a para encontrar
        <br />
        <strong>tu propiedad ideal?</strong>
      </h2>

      <p className="contact-desc">
        Completá el formulario con tus preferencias y un asesor se pondrá en contacto con vos a la
        brevedad. Sin compromiso, con total confidencialidad.
      </p>

      <div className="contact-cards">
        <a href={`tel:${TELEFONO}`} className="contact-card">
          <span className="contact-card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <div>
            <div className="contact-card-label">Llamanos</div>
            <div className="contact-card-value">{TELEFONO_VISIBLE}</div>
          </div>
        </a>

        <a
          href={`https://wa.me/${TELEFONO.replace("+", "")}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`}
          className="contact-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-card-icon" style={{ background: "#e8fdf0", color: "#25D366" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <div>
            <div className="contact-card-label">WhatsApp</div>
            <div className="contact-card-value">{TELEFONO_VISIBLE}</div>
          </div>
        </a>
      </div>
    </div>
  );
}
