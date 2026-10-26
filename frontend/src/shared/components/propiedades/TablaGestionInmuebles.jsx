import { formatearPrecio } from "../../utils/formato";
import { obtenerUrlImagen } from "../../../shared/utils/imagenUrl";

const CLASES_ESTADO = {
  activo: "bg-success text-white",
  inactivo: "bg-secondary text-white",
};

export default function TablaGestionInmuebles({
  propiedades = [],
  onEditar,
  onAlternarEstado,
}) {
  if (!propiedades || propiedades.length === 0) return null;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr className="small text-secondary">
            <th>Inmueble</th>
            <th>Zona</th>
            <th>Tipo / Op.</th>
            <th>Precio</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propiedades.map((p) => {
            const urlImagen =
              p.imagenes && p.imagenes.length > 0 ? p.imagenes[0].url : p.img;

            const estadoActual = p.estado_visibilidad || p.estado || "activo";
            const tipoOperacion = p.estado_comercial || p.tipo || "venta";

            return (
              <tr key={p.id}>
                {/* Foto + Título + Dirección */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={obtenerUrlImagen(urlImagen)}
                      alt={p.titulo}
                      className="rounded-3 object-fit-cover border"
                      style={{ width: "45px", height: "45px" }}
                      onError={(e) => {
                        e.target.src = "/img/propiedades/prop1.jpg";
                      }}
                    />
                    <div>
                      <div
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "220px" }}
                      >
                        {p.titulo}
                      </div>
                      <small className="text-muted">{p.direccion}</small>
                    </div>
                  </div>
                </td>

                {/* Zona */}
                <td>{p.zona}</td>

                {/* Tipo / Categoría */}
                <td>
                  <small className="text-capitalize">
                    {p.categoria} ({tipoOperacion})
                  </small>
                </td>

                {/* Precio */}
                <td className="fw-bold">
                  {p.moneda == 'USD' ? formatearPrecio(p.precio)
                    : formatearPrecio(p.precio, p.moneda)}
                </td>

                {/* Estado: Selector de Visibilidad o Badge */}
                <td>
                  <span
                    className={`badge rounded-pill px-3 py-1 text-capitalize ${
                      CLASES_ESTADO[estadoActual] || "bg-secondary text-white"
                    }`}
                    style={{ fontSize: "0.8rem", fontWeight: "500" }}
                  >
                    {estadoActual}
                  </span>
                </td>

                {/* Acciones */}
                <td className="text-end">
                  {onEditar && (
                    <button
                      className="btn btn-sm btn-outline-primary rounded-pill px-2 me-1"
                      onClick={() => onEditar(p)}
                    >
                      Editar
                    </button>
                  )}
                 {onAlternarEstado && (
                    <button
                      className={`btn btn-sm rounded-pill px-2 ${
                        estadoActual === 'activo'
                          ? 'btn-outline-danger'
                          : 'btn-outline-success'
                      }`}
                      onClick={() => onAlternarEstado(p.id, p.titulo, estadoActual)}
                    >
                      {estadoActual === 'activo' ? 'Baja' : 'Alta'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
