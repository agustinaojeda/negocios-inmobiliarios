import "./Calculadora.css";

export default function Calculadora() {
  return (
    <section className="calculadora-section" id="calculadora" aria-labelledby="calculadora-title">
      <div className="container">
        <div className="calculadora-grid">
          <div className="calculadora-info">
            <span className="section-tag">Calculadora</span>

            <h2 className="section-title" id="calculadora-title">
              Calcula los aumentos de tu propiedad con
              <br />
              <strong>nuestra herramienta de estimación</strong>
            </h2>

            <p className="calculadora-desc">
              Ingresá el monto actual del alquiler y consultá cuánto te corresponde pagar en el próximo
              período según los índices oficiales.
            </p>
          </div>

          <div className="calculadora-form-wrap">
            <iframe
              title="Calculadora de alquileres"
              src="https://arquiler.com/mini?theme=light&backgroundColor=ffffff"
              id="calculadora-iframe"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
