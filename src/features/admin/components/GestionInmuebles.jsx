import { useState } from "react";
import { useFetch } from "../../../shared/hooks/useFetch";
import { obtenerPropiedades } from "../../inmuebles";
import { formatearPrecio } from "../../../shared/utils/formato";
import Spinner from "../../../shared/components/Spinner";
import MensajeVacio from "../../../shared/components/MensajeVacio";

export default function GestionInmuebles() {
    // datos: le asignamos un alias "propiedades" y valor por defecto []
    const { datos: propiedades = [], cargando, error } = useFetch(obtenerPropiedades);

    const [filtroEstado, setFiltroEstado] = useState("todos");
    const listaPropiedades = propiedades || [];

    const propiedadesFiltradas = filtroEstado === "todos"
        ? listaPropiedades
        : listaPropiedades.filter((p) => p.estado === filtroEstado);

    if (cargando) return <Spinner texto="Cargando catálogo..." />
    if (error) return <MensajeVacio titulo="No pudimos cargar el catálogo" texto={error.message} />

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
                        Supervisión y Catálogo de Inmuebles
                    </h2>
                    <p className="text-muted small mb-0">
                        Control de publicaciones, estados y asignaciones.
                    </p>
                </div>
                <button className="btn btn-sm btn-primary rounded-pill px-3">
                    + Publicar Inmueble
                </button>
            </div>

            {/* Filtros rápidos por estado */}
            <div className="btn-group btn-group-sm mb-3">
                {["todos", "disponible", "reservado", "vendido"].map((estado) => (
                    <button
                        key={estado}
                        className={`btn ${filtroEstado === estado ? "btn-dark" : "btn-outline-secondary"}`}
                        onClick={() => setFiltroEstado(estado)}
                    >
                        {estado.toUpperCase()}
                    </button>
                ))}
            </div>

            {cargando ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" />
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Inmueble</th>
                                <th>Zona</th>
                                <th>Tipo / Op.</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propiedadesFiltradas.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={p.img}
                                                alt={p.titulo}
                                                className="rounded-3 object-fit-cover"
                                                style={{ width: "45px", height: "45px" }}
                                            />
                                            <div>
                                                <div className="fw-semibold text-truncate" style={{ maxWidth: "220px" }}>
                                                    {p.titulo}
                                                </div>
                                                <small className="text-muted">{p.direccion}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{p.zona}</td>
                                    <td>
                                        <small className="text-capitalize">{p.categoria} ({p.tipo})</small>
                                    </td>
                                    <td className="fw-bold">{formatearPrecio(p.precio)}</td>
                                    <td>
                                        <span
                                            className={`badge rounded-pill ${p.estado === "disponible"
                                                ? "bg-success"
                                                : p.estado === "reservado"
                                                    ? "bg-warning text-dark"
                                                    : "bg-secondary"
                                                }`}
                                        >
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary rounded-pill px-2 me-1">
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger rounded-pill px-2">
                                            Pausar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
