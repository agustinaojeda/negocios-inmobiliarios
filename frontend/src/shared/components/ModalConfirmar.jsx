import { useEffect } from "react";

const CLASES_BOTON = {
  danger: "btn-danger",
  success: "btn-success",
  primary: "btn-primary",
};

export default function ModalConfirmar({
  mostrar,
  titulo = "Confirmar acción",
  mensaje,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  variante = "danger",
  cargando = false,
  zIndex = 1060,
  onConfirmar,
  onCerrar,
}) {
  useEffect(() => {
    if (!mostrar) return;

    const manejarTecla = (evento) => {
      if (evento.key === "Escape" && !cargando) onCerrar?.();
    };

    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [mostrar, cargando, onCerrar]);

  if (!mostrar) return null;

  const claseBoton = CLASES_BOTON[variante] || CLASES_BOTON.danger;

  const manejarBackdrop = (evento) => {
    if (evento.target === evento.currentTarget && !cargando) onCerrar?.();
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex }}
      onClick={manejarBackdrop}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header border-0 px-4 pt-4 pb-1">
            <h5 className="modal-title fw-bold" style={{ color: "#13284c" }}>
              {titulo}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onCerrar}
              disabled={cargando}
            ></button>
          </div>

          <div className="modal-body px-4 py-3">
            <p className="mb-0 text-secondary">{mensaje}</p>
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-1">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onCerrar}
              disabled={cargando}
              autoFocus
            >
              {textoCancelar}
            </button>
            <button
              type="button"
              className={`btn rounded-pill px-4 fw-medium ${claseBoton}`}
              onClick={onConfirmar}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Procesando...
                </>
              ) : (
                textoConfirmar
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
