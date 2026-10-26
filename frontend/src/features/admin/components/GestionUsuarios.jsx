import { useState } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useAlerta } from "../../../shared/hooks/useAlerta";
import Spinner from "../../../shared/components/Spinner";
import MensajeVacio from "../../../shared/components/MensajeVacio";
import Alerta from "../../../shared/components/panel/Alerta";
import { listarUsuarios, cambiarEstadoUsuario } from "../../../shared/services/usuariosService";
import { obtenerSesion } from "../../auth/services/authService";
import { resolverUrlImagen } from "../../../shared/config/api";
import ModalCrearUsuario from "./ModalCrearUsuario";

const avatarDefecto = (nombre) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nombre || "Usuario",
    )}&background=13284c&color=fff`;

const nombreCompleto = (u) => `${u.nombre || ""} ${u.apellido || ""}`.trim();

export default function GestionUsuarios() {
    // "version" se pasa como parámetro a useFetch: al incrementarla se vuelve a pedir la lista
    const [version, setVersion] = useState(0);
    const { datos: usuarios, cargando, error } = useFetch(listarUsuarios, version);

    // Filas modificadas localmente (respuesta del PATCH) que pisan a las de la lista
    const [actualizados, setActualizados] = useState({});
    const [procesandoId, setProcesandoId] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const { alerta, mostrarExito, mostrarError, cerrar } = useAlerta();

    const navigate = useNavigate();
    const idSesion = Number(obtenerSesion()?.id);

    if (cargando) return <Spinner texto="Cargando usuarios..." />;
    if (error) return <MensajeVacio titulo="No pudimos cargar los usuarios" texto={error.message} />;

    const listaUsuarios = (usuarios || []).map((u) => actualizados[u.id] || u);

    const handleEditar = (usuario) => {
        navigate(`/admin/usuarios/${usuario.id}`);
    };

    // PATCH /api/usuarios/:id/estado
    const handleCambiarEstado = async (usuario) => {
        const nuevoEstado = !usuario.estaActivo;
        const accion = nuevoEstado ? "activar" : "desactivar";

        if (!window.confirm(`¿Seguro que querés ${accion} a ${nombreCompleto(usuario)}?`)) return;

        try {
            setProcesandoId(usuario.id);
            const actualizado = await cambiarEstadoUsuario(usuario.id, nuevoEstado);
            setActualizados((prev) => ({ ...prev, [actualizado.id]: actualizado }));
            mostrarExito(
                `${nombreCompleto(actualizado)} ahora está ${actualizado.estaActivo ? "activo" : "inactivo"}.`,
            );
        } catch (err) {
            mostrarError(err.message || "No se pudo cambiar el estado del usuario.");
        } finally {
            setProcesandoId(null);
        }
    };

    const handleUsuarioCreado = () => {
        setActualizados({});
        setVersion((v) => v + 1);
        mostrarExito("Usuario creado correctamente.");
    };

    const totalActivos = listaUsuarios.filter((u) => u.estaActivo).length;

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
                        Gestión de Usuarios
                    </h2>
                    <p className="text-muted small mb-0">
                        Administra las cuentas de usuarios de la plataforma y asigna sus roles.
                        {listaUsuarios.length > 0 && (
                            <span className="ms-1">
                                ({listaUsuarios.length} en total · {totalActivos} activos)
                            </span>
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    id="btn-nuevo-usuario"
                    className="btn btn-primary rounded-pill px-3 fw-semibold"
                    onClick={() => setMostrarModal(true)}
                >
                    + Nuevo Usuario
                </button>
            </div>

            <Alerta alerta={alerta} onCerrar={cerrar} />

            {listaUsuarios.length === 0 ? (
                <MensajeVacio titulo="No hay usuarios registrados" texto="Todavía no hay cuentas en la plataforma." />
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3">Avatar</th>
                                <th className="py-3">Nombre</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Teléfono</th>
                                <th className="py-3">Rol</th>
                                <th className="py-3">Estado</th>
                                <th className="py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaUsuarios.map((usuario) => {
                                const esMiCuenta = usuario.id === idSesion;
                                const procesando = procesandoId === usuario.id;

                                return (
                                    <tr key={usuario.id} className={usuario.estaActivo ? "" : "text-muted"}>
                                        <td className="py-3">
                                            <img
                                                src={
                                                    resolverUrlImagen(usuario.fotoPerfil) ||
                                                    avatarDefecto(nombreCompleto(usuario))
                                                }
                                                alt="Avatar"
                                                className="rounded-circle object-fit-cover shadow-sm"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    opacity: usuario.estaActivo ? 1 : 0.5,
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 fw-medium">
                                            {nombreCompleto(usuario)}
                                            {esMiCuenta && (
                                                <span className="badge rounded-pill bg-light text-secondary border ms-2">
                                                    Vos
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-muted">{usuario.email}</td>
                                        <td className="py-3 text-muted">{usuario.telefono || "-"}</td>
                                        <td className="py-3">
                                            <span
                                                className={`badge rounded-pill ${
                                                    usuario.rol === "admin"
                                                        ? "bg-primary"
                                                        : usuario.rol === "agente"
                                                        ? "bg-success"
                                                        : usuario.rol === "propietario"
                                                        ? "bg-warning text-dark"
                                                        : "bg-info text-dark"
                                                }`}
                                            >
                                                {usuario.rol || "sin rol"}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`badge rounded-pill ${
                                                    usuario.estaActivo
                                                        ? "bg-success-subtle text-success-emphasis"
                                                        : "bg-secondary-subtle text-secondary-emphasis"
                                                }`}
                                            >
                                                {usuario.estaActivo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-nowrap">
                                            <button
                                                id={`btn-editar-usuario-${usuario.id}`}
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                                                onClick={() => handleEditar(usuario)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                id={`btn-estado-usuario-${usuario.id}`}
                                                className={`btn btn-sm rounded-pill px-3 ${
                                                    usuario.estaActivo ? "btn-outline-danger" : "btn-outline-success"
                                                }`}
                                                onClick={() => handleCambiarEstado(usuario)}
                                                disabled={esMiCuenta || procesando}
                                                title={esMiCuenta ? "Tu cuenta" : undefined}
                                            >
                                                {procesando
                                                    ? "Guardando..."
                                                    : usuario.estaActivo
                                                    ? "Desactivar"
                                                    : "Activar"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para crear usuario */}
            <ModalCrearUsuario
                mostrar={mostrarModal}
                onCerrar={() => setMostrarModal(false)}
                onUsuarioCreado={handleUsuarioCreado}
            />
        </div>
    );
}