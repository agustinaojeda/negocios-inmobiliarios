import React from 'react';
import '../styles/DetalleInmueblesPage.css';
import { useParams, useOutletContext } from 'react-router';
import { useFetch } from '../../../shared/hooks/useFetch';
import Spinner from '../../../shared/components/Spinner';
import { obtenerPropiedadPorId } from '../services/inmueblesService';
import { useFavoritos } from '../../inquilino/hooks/useFavoritos';
import { agregarFavorito, eliminarFavorito } from '../../inquilino/services/favoritosService';4

// Subcomponentes
import GaleriaInmueble from '../components/GaleriaInmueble';
import FichaTecnica from '../components/FichaTecnica';
import ContactoAsesor from '../components/ContactoAsesor';
import PropiedadesSimilares from '../components/PropiedadesSimilares';
import { obtenerSesion } from '../../auth/services/authService';

export default function DetalleInmueblesPage() {
  const sesion = obtenerSesion();
  const usuario = sesion?.usuario || sesion;
  const esInquilino =
    usuario && (usuario.rol === "inquilino" || usuario.rol_id === 3);

  const { id } = useParams();
  const { mostrarToast } = useOutletContext();
  const { favoritos } = useFavoritos();

  const { datos: propiedad, cargando, error } = useFetch(obtenerPropiedadPorId, id);

  if (cargando) return <Spinner texto="Cargando detalles de la propiedad..." />;
  if (error) return <div className="container py-5 text-center"><h2>Error: {error.message}</h2></div>;
  if (!propiedad) return null;

  const esFavorito = favoritos.some((f) => Number(f.id) === Number(propiedad.id));

  const operacion = propiedad.estado_comercial || 'venta';
  const visibilidad = propiedad.estado_visibilidad || propiedad.estado || 'activo';
  const tipoOperacion = operacion.charAt(0).toUpperCase() + operacion.slice(1);

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href);
    mostrarToast('Enlace copiado al portapapeles');
  };

  const handleToggleFavorito = async () => {
    try {
      if (esFavorito) {
        await eliminarFavorito(propiedad.id);
        mostrarToast('Propiedad eliminada de favoritos');
      } else {
        await agregarFavorito(propiedad.id);
        mostrarToast('Propiedad guardada en favoritos');
      }
      window.dispatchEvent(new Event("favoritosUpdated"));
    } catch (err) {
      console.error(err);
      mostrarToast(err.message || 'Error al actualizar favoritos');
    }
  };

  return (
    <div className="page-top">
      {/* Topbar */}
      <div className="property-topbar">
        <div className="container">
          <div className="property-topbar-inner">
            <div className="topbar-left">
              <span className="topbar-badge venta">{tipoOperacion}</span>
              <span className={`topbar-badge ${visibilidad.toLowerCase()}`}>
                {visibilidad.toUpperCase()}
              </span>
            </div>

            <div className="topbar-actions">
              {/* Botón Guardar en favoritos */}
              {esInquilino && (
              <button
                className={`topbar-btn prop-fav-btn ${esFavorito ? 'active' : ''}`}
                id="propFavBtn"
                aria-pressed={esFavorito}
                aria-label={esFavorito ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
                onClick={handleToggleFavorito}
              >
                <span className="fav-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={esFavorito ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>

                {esFavorito ? 'Guardado' : 'Guardar'}
              </button>
              )}

              {/* Botón Compartir */}
              <button
                className="topbar-btn"
                id="shareBtn"
                aria-label="Compartir propiedad"
                onClick={handleCopiarEnlace}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
                Compartir
              </button>

              {/* Botón Consultar */}
              <button
                className="topbar-btn primary-action"
                id="topbar-contactar"
                onClick={() => {
                  document
                    .getElementById('contacto-asesor')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.5 8.5 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>

      <GaleriaInmueble imagenes={propiedad.imagenes} titulo={propiedad.titulo} />

      <section>
        <div className="container">
          <div className="detail-layout">
            <FichaTecnica propiedad={propiedad} />

            <ContactoAsesor
              propiedad={propiedad}
              mostrarToast={mostrarToast}
            />
          </div>
        </div>
      </section>

      <PropiedadesSimilares />
    </div>
  );
}