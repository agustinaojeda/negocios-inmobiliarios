import { useEffect } from "react";
import Spinner from "../../../shared/components/Spinner";
import MensajeVacio from "../../../shared/components/MensajeVacio";
import { formatearPrecio } from "../../../shared/utils/formato";

function formatearFecha(fecha) {
  if (!fecha) return "—";

  const soloFecha = String(fecha).split("T")[0];
  const [anio, mes, dia] = soloFecha.split("-");
  if (!anio || !mes || !dia) return String(fecha);

  return `${dia}/${mes}/${anio}`;
}

function formatearVariacion(variacion) {
  if (variacion === null) return "—";

  const signo = variacion > 0 ? "+" : "";
  return `${signo}${variacion.toLocaleString("es-AR", {
    maximumFractionDigits: 1,
  })}%`;
}

export default function ModalHistorialPrecios({
  mostrar,
  onCerrar,
  propiedad,
  historial = [],
  precioActual,
  cargando = false,
  error = null,
  onReintentar,
}) {
  useEffect(() => {
    if (!mostrar) return;

    const manejarTecla = (evento) => {
      if (evento.key === "Escape") onCerrar();
    };

    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [mostrar, onCerrar]);

  if (!mostrar) return null;

  const moneda = propiedad?.moneda || "USD";
  const precioReferencia = precioActual ?? propiedad?.precio;
  const registros = [...(historial || [])].reverse();

  const manejarBackdrop = (evento) => {
    if (evento.target === evento.currentTarget) onCerrar();
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
      onClick={manejarBackdrop}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="modal-header border-0 text-white px-4 py-3"
            style={{ backgroundColor: "#13284c" }}
          >
            <div>
              <h5 className="modal-title fw-bold mb-0">Historial de precios</h5>
              <small className="opacity-75">
                {propiedad?.titulo || "Inmueble"}
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar"
              onClick={onCerrar}
            ></button>
          </div>

          <div className="modal-body px-4 py-3">
            {cargando ? (
              <Spinner texto="Cargando historial..." />
            ) : error ? (
              <MensajeVacio titulo="No pudimos cargar el historial" texto={error}>
                {onReintentar && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-pill px-4"
                    style={{ backgroundColor: "#13284c", borderColor: "#13284c" }}
                    onClick={onReintentar}
                  >
                    Reintentar
                  </button>
                )}
              </MensajeVacio>
            ) : (
              <>
                {precioReferencia !== undefined && precioReferencia !== null && (
                  <div
                    className="d-flex justify-content-between align-items-center rounded-3 px-3 py-2 mb-3"
                    style={{ backgroundColor: "#f1f4f9" }}
                  >
                    <div>
                      <div className="text-muted small mb-0">Precio actual</div>
                      <div
                        className="h5 fw-bold mb-0"
                        style={{ color: "#13284c" }}
                      >
                        {formatearPrecio(Number(precioReferencia), moneda)}
                      </div>
                    </div>
                    <span className="badge rounded-pill border text-body-secondary bg-white">
                      {registros.length}{" "}
                      {registros.length === 1 ? "cambio" : "cambios"}
                    </span>
                  </div>
                )}

                {registros.length === 0 ? (
                  <MensajeVacio
                    titulo="Sin cambios de precio"
                    texto="Todavía no hay cambios de precio registrados"
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr className="small text-secondary">
                          <th>Fecha</th>
                          <th className="text-end">Precio anterior</th>
                          <th className="text-end">Precio nuevo</th>
                          <th className="text-end">Diferencia</th>
                          <th className="text-end">Variación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registros.map((item) => {
                          const diferencia = item.precio_nuevo - item.precio_anterior;
                          const variacion = item.precio_anterior
                            ? (diferencia / item.precio_anterior) * 100
                            : null;

                          const claseVariacion =
                            diferencia > 0
                              ? "text-danger"
                              : diferencia < 0
                                ? "text-success"
                                : "text-body-secondary";

                          return (
                            <tr key={item.id}>
                              <td className="small">
                                {formatearFecha(item.fecha_cambio)}
                              </td>
                              <td className="text-end">
                                {formatearPrecio(item.precio_anterior, moneda)}
                              </td>
                              <td className="text-end fw-semibold">
                                {formatearPrecio(item.precio_nuevo, moneda)}
                              </td>
                              <td className={`text-end fw-semibold ${claseVariacion}`}>
                                {diferencia > 0 ? "+" : ""}
                                {formatearPrecio(diferencia, moneda)}
                              </td>
                              <td className={`text-end small ${claseVariacion}`}>
                                {formatearVariacion(variacion)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-footer border-0 px-4 pb-4 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onCerrar}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
