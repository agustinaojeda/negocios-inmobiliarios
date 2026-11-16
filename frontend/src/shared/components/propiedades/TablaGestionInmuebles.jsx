import { Link } from "react-router";
import { formatearPrecio } from "../../utils/formato";
import { obtenerUrlImagen } from "../../../shared/utils/imagenUrl";
import BotonAccion from "../BotonAccion";
import { IconoHistorial, IconoEditar, IconoBaja, IconoAlta } from "../Iconos";

const CLASES_ESTADO = {
  activo: "bg-success text-white",
  inactivo: "bg-secondary text-white",
};

export default function TablaGestionInmuebles({
  propiedades = [],
  onEditar,
  onAlternarEstado,
  onVerHistorial,
  admin = false,
  idsConOperacion,
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
            {admin && <th>Agente a cargo</th>}
            <th>Estado</th>
            {!admin && <th className="text-end">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {propiedades.map((p) => {
            const urlImagen =
              p.imagenes && p.imagenes.length > 0 ? p.imagenes[0].url : p.img;

            const estadoActual = p.estado_visibilidad || p.estado || "activo";
            const tipoOperacion = p.estado_comercial || p.tipo || "venta";
            const operada = Boolean(
              idsConOperacion && idsConOperacion.has(Number(p.id))
            );
            const altaBloqueada = estadoActual !== "activo" && operada;

            return (
              <tr key={p.id}>
                {/* Foto + Título + Dirección */}
                <td>
                  <Link
                    to={`/inmueble/${p.id}`} target="_blank" rel="noopener noreferrer"
                    className="text-decoration-none h-100 d-block text-dark"
                  >
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
                  </Link>
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
                  {p.moneda == "USD"
                    ? formatearPrecio(p.precio)
                    : formatearPrecio(p.precio, p.moneda)}
                </td>

                
                  {admin &&
                  <td>{p.agente_nombre} {p.agente_apellido}</td>}

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
                <td className="text-end" style={{ whiteSpace: "nowrap" }}>
                  <div className="d-inline-flex gap-1 justify-content-end">
                    {onVerHistorial && (
                      <BotonAccion
                        etiqueta="Ver historial de precios"
                        onClick={() => onVerHistorial(p)}
                        colorIcono="text-secondary"
                      >
                        <IconoHistorial />
                      </BotonAccion>
                    )}
                    {onEditar && (
                      <BotonAccion
                        etiqueta="Editar inmueble"
                        onClick={() => onEditar(p)}
                        colorIcono="text-primary"
                      >
                        <IconoEditar />
                      </BotonAccion>
                    )}
                    {onAlternarEstado && (
                      <BotonAccion
                        etiqueta={
                          estadoActual === "activo"
                            ? "Dar de baja"
                            : "Dar de alta"
                        }
                        onClick={() =>
                          onAlternarEstado(p.id, p.titulo, estadoActual)
                        }
                        disabled={altaBloqueada}
                        motivoDeshabilitado="El inmueble tiene una operación cerrada registrada"
                        colorIcono={
                          altaBloqueada
                            ? "text-muted"
                            : estadoActual === "activo"
                              ? "text-danger"
                              : "text-success"
                        }
                      >
                        {estadoActual === "activo" ? <IconoBaja /> : <IconoAlta />}
                      </BotonAccion>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
