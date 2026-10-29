import React, { useState, useEffect } from 'react';
import { esRequerido, esEmailValido } from '../../../shared/utils/validaciones';
import { solicitarCita } from '../../inquilino/services/citasService';
import { obtenerSesion } from '../../auth/services/authService';
import '../styles/ContactoAsesor.css';

export default function ContactoAsesor({ propiedad, mostrarToast }) {
  const propiedadId = propiedad.id;
  const sesion = obtenerSesion();

  const maniana = new Date();
  maniana.setDate(maniana.getDate() + 1);
  const fechaMinima = maniana.toISOString().split('T')[0];

  const [valores, setValores] = useState({
    nombre: sesion?.nombre || '',
    email: sesion?.email || '',
    fecha: fechaMinima || '',
    hora: '',
    mensaje: `Hola, me interesa coordinar una visita para la propiedad: ${propiedad.titulo}`,
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Si cambia el título o se carga la sesión, actualizamos los datos iniciales
  useEffect(() => {
    if (sesion) {
      setValores((prev) => ({
        ...prev,
        nombre: prev.nombre || sesion.nombre || '',
        email: prev.email || sesion.email || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    setValores({ ...valores, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: false });
  };

  const handleSubmit = async (e) => {
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

    // 1. Validar que el usuario tenga sesión iniciada
    if (!sesion) {
      mostrarToast('Debés iniciar sesión con tu cuenta para agendar una visita.');
      return;
    }

    setEnviando(true);

    try {
      // 2. Llamada a la API real del Backend
      await solicitarCita({
        propiedadId,
        fecha: valores.fecha,
        hora: valores.hora,
        mensaje: valores.mensaje,
      });

      mostrarToast('¡Solicitud de visita enviada con éxito!');
      setValores({
        nombre: sesion?.nombre || '',
        email: sesion?.email || '',
        fecha: '',
        hora: '',
        mensaje: `Hola, me interesa coordinar una visita para la propiedad: ${propiedad.titulo}`,
      });
    } catch (error) {
      mostrarToast(error.message || 'Error al agendar la visita.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <aside className="detail-sidebar" id="contacto-asesor" aria-label="Panel lateral de contacto">
      <div className="agent-card reveal visible">
        <div className="agent-card-header">
          <img src="/img/fotoAsesor.png" alt="Asesora" className="agent-avatar" />
          <div>
            <div className="agent-name">{propiedad.agente_nombre} {propiedad.agente_apellido}</div>
            <div className="agent-title">{propiedad.agente_email}</div>
            <div className="agent-phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.63 6.63l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {propiedad.agente_telefono}
            </div>
          </div>
        </div>

        <div className="agent-card-body">
          <div className="contact-form-title">Agendar Visita</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="contactNombre">Nombre completo</label>
              <input
                type="text"
                id="contactNombre"
                name="nombre"
                value={valores.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                style={{ borderColor: errores.nombre ? '#dc2626' : '' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Email</label>
              <input
                type="email"
                id="contactEmail"
                name="email"
                value={valores.email}
                onChange={handleChange}
                placeholder="ejemplo@gmail.com"
                style={{ borderColor: errores.email ? '#dc2626' : '' }}
              />
            </div>

            <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginBottom: '0.875rem' }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label htmlFor="contactFecha">Fecha</label>
                <input
                  type="date"
                  id="contactFecha"
                  name="fecha"
                  min={fechaMinima}
                  value={valores.fecha}
                  onChange={handleChange}
                  style={{ borderColor: errores.fecha ? '#dc2626' : '' }}
                />
              </div>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label htmlFor="contactHora">Hora</label>
                <select
                  id="contactHora"
                  name="hora"
                  value={valores.hora}
                  onChange={handleChange}
                  style={{ padding: '0.65rem', borderColor: errores.hora ? '#dc2626' : '' }}
                >
                  <option value="" disabled>Elegir</option>
                  <option value="10:00:00">10:00 hs</option>
                  <option value="12:00:00">12:00 hs</option>
                  <option value="16:00:00">16:00 hs</option>
                  <option value="18:00:00">18:00 hs</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactMensaje">Mensaje</label>
              <textarea
                id="contactMensaje"
                name="mensaje"
                value={valores.mensaje}
                onChange={handleChange}
                style={{ borderColor: errores.mensaje ? '#dc2626' : '' }}
              ></textarea>
            </div>

            <button type="submit" className="btn-contact" disabled={enviando}>
              {enviando ? 'Agendando...' : 'Solicitar Turno de Visita'}
            </button>

            <a
              href="https://wa.me/5491155551234"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-contact"
            >
              Consultar por WhatsApp
            </a>
          </form>
        </div>
      </div>
    </aside>
  );
}
