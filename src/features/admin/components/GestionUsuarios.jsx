import { useState, useEffect } from "react";
import { obtenerTodosLosUsuarios } from "../../auth";
import { useNavigate } from "react-router";
import { useFetch } from "../../../shared/hooks/useFetch";
import Spinner from "../../../shared/components/Spinner";
import MensajeVacio from "../../../shared/components/MensajeVacio";
import ModalCrearUsuario from "./ModalCrearUsuario";

export default function GestionUsuarios() {
    const { datos: usuarios = [], cargando, error } = useFetch(obtenerTodosLosUsuarios);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const navigate = useNavigate();

    // Sincronizar los usuarios cargados por useFetch con el estado local
    useEffect(() => {
        if (usuarios && usuarios.length > 0) {
            setListaUsuarios(usuarios);
        }
    }, [usuarios]);

    if (cargando) return <Spinner texto="Cargando usuarios..." />;
    if (error) return <MensajeVacio titulo="No pudimos cargar los usuarios" texto={error.message} />;

    const avatarDefecto = (nombre) =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            nombre || "Usuario",
        )}&background=13284c&color=fff`;

    const handleEditar = (usuario) => {
        navigate(`/admin/usuarios/${usuario.id}`);
    };

    const handleEliminar = (usuario) => {
        if (window.confirm(`¿Está seguro de eliminar al usuario ${usuario.nombre}?`)) {
            setListaUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
            console.log("Eliminar usuario:", usuario);
        }
    };

    const handleUsuarioCreado = (nuevoUsuario) => {
        setListaUsuarios((prev) => [nuevoUsuario, ...prev]);
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h5 fw-bold mb-1" style={{ color: "#13284c" }}>
                        Gestión de Usuarios
                    </h2>
                    <p className="text-muted small mb-0">
                        Administra las cuentas de usuarios de la plataforma y asigna sus roles.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary rounded-pill px-3 fw-semibold"
                    onClick={() => setMostrarModal(true)}
                >
                    + Nuevo Usuario
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="py-3">Avatar</th>
                            <th className="py-3">Nombre</th>
                            <th className="py-3">Email</th>
                            <th className="py-3">Teléfono</th>
                            <th className="py-3">Rol</th>
                            <th className="py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaUsuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td className="py-3">
                                    <img
                                        src={usuario.fotoPerfil || avatarDefecto(usuario.nombre)}
                                        alt="Avatar"
                                        className="rounded-circle object-fit-cover shadow-sm"
                                        style={{ width: "40px", height: "40px" }}
                                    />
                                </td>
                                <td className="py-3 fw-medium">{usuario.nombre}</td>
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
                                        {usuario.rol}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <button
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                                        onClick={() => handleEditar(usuario)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                        onClick={() => handleEliminar(usuario)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear usuario */}
            <ModalCrearUsuario
                mostrar={mostrarModal}
                onCerrar={() => setMostrarModal(false)}
                onUsuarioCreado={handleUsuarioCreado}
            />
        </div>
    );
}