import { FormularioRegistro, registrarUsuario } from "../../auth";

export default function ModalCrearUsuario({ mostrar, onCerrar, onUsuarioCreado }) {
  if (!mostrar) return null;

  const handleCrearUsuario = async (datos) => {
    const nuevoUsuario = await registrarUsuario(datos);
    onUsuarioCreado(nuevoUsuario);
    onCerrar();
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-light border-0 px-4 pt-4 pb-2">
            <div>
              <h5 className="modal-title fw-bold" style={{ color: "#13284c" }}>
                Crear Nuevo Usuario
              </h5>
              <p className="text-muted small mb-0">
                Completa los datos y asigna el rol correspondiente.
              </p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onCerrar}
            ></button>
          </div>

          {/* Body con Formulario reutilizado */}
          <div className="modal-body px-4 py-3">
            <FormularioRegistro
              mostrarSelectorRol={true}
              textoBoton="Crear Usuario"
              onRegistroExitoso={handleCrearUsuario}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

