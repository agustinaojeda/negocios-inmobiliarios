import React, { useState } from 'react';
import { esRequerido, esEmailValido } from '../../../shared/utils/validaciones';
import './ContactoAsesor.css';

export default function ContactoAsesor({ tituloPropiedad, mostrarToast }) {
  const [valores, setValores] = useState({
    nombre: '', email: '', fecha: '', hora: '', 
    mensaje: `Hola, me interesa la propiedad: ${tituloPropiedad}`
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setValores({ ...valores, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    
    if (!esRequerido(valores.nombre)) errs.nombre = true;
    if (!esEmailValido(valores.email)) errs.email = true;
    if (!esRequerido(valores.fecha)) errs.fecha = true;
    if (!esRequerido(valores.hora)) errs.hora = true;
    if (!esRequerido(valores.mensaje)) errs.mensaje = true;

    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      mostrarToast('Por favor, completá los campos en rojo.');
      return;
    }

    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      mostrarToast('Consulta enviada. La asesora se contactará a la brevedad.');
      setValores({ nombre: '', email: '', fecha: '', hora: '', mensaje: `Hola, me interesa la propiedad: ${tituloPropiedad}` });
    }, 1500);
  };

  return (
    <aside className="detail-sidebar" id="contacto-asesor" aria-label="Panel lateral de contacto">
      <div className="agent-card reveal visible">
        <div className="agent-card-header">
          <img src="/img/fotoAsesor.png" alt="Asesora" className="agent-avatar" />
          <div>
            <div className="agent-name">María Gómez</div>
            <div className="agent-title">Asesora Premier</div>
            <div className="agent-phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.63 6.63l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              +54 11 5555-1234
            </div>
          </div>
        </div>

        <div className="agent-card-body">
          <div className="contact-form-title">Solicitar Información</div>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="contactNombre">Nombre completo</label>
              <input type="text" id="contactNombre" name="nombre" value={valores.nombre} onChange={handleChange} placeholder="Tu nombre" style={{ borderColor: errores.nombre ? '#dc2626' : '' }} />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactEmail">Email</label>
              <input type="email" id="contactEmail" name="email" value={valores.email} onChange={handleChange} placeholder="ejemplo@gmail.com" style={{ borderColor: errores.email ? '#dc2626' : '' }} />
            </div>

            <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label htmlFor="contactFecha">Fecha</label>
                <input type="date" id="contactFecha" name="fecha" value={valores.fecha} onChange={handleChange} style={{ borderColor: errores.fecha ? '#dc2626' : '' }} />
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label htmlFor="contactHora">Hora</label>
                <select id="contactHora" name="hora" value={valores.hora} onChange={handleChange} style={{ padding: '0.65rem', borderColor: errores.hora ? '#dc2626' : '' }}>
                  <option value="" disabled>Elegir</option>
                  <option value="10:00">10:00 hs</option>
                  <option value="12:00">12:00 hs</option>
                  <option value="16:00">16:00 hs</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactMensaje">Mensaje</label>
              <textarea id="contactMensaje" name="mensaje" value={valores.mensaje} onChange={handleChange} style={{ borderColor: errores.mensaje ? '#dc2626' : '' }}></textarea>
            </div>
            
            <button type="submit" className="btn-contact" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Contactar Asesora'}
            </button>
            
            <a href="https://wa.me/5491155551234" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-contact">
              Consultar por WhatsApp
            </a>
          </form>
        </div>
      </div>
    </aside>
  );
}