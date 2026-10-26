import FormInput from "../../../shared/components/panel/FormInput";
import { useModalFormularioInmueble } from "../hooks/useModalFormularioInmuebles";
import { obtenerUrlImagen } from "../../../shared/utils/imagenUrl";

const CATEGORIAS_INMUEBLE = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "ph", label: "PH" },
  { value: "terreno", label: "Terreno / Lote" },
  { value: "local", label: "Local Comercial" },
];

export default function ModalFormularioInmuebles(props) {
  const { mostrar, onCerrar } = props;
  const {
    formData,
    propietarios,
    errores,
    guardando,
    esEdicion,
    handleChange,
    handleFileChange,
    handleSubmit,
    imagenesExistentes,
    previewsLocales,
    handleRemoveImage,
  } = useModalFormularioInmueble(props);

  if (!mostrar) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="modal-header border-0 text-white px-4 py-3"
            style={{ backgroundColor: "#13284c" }}
          >
            <div>
              <h5 className="modal-title fw-bold mb-0">
                {esEdicion
                  ? "Editar Inmueble Asignado"
                  : "Captar Nuevo Inmueble"}
              </h5>
              <small className="opacity-75">
                {esEdicion
                  ? "Actualizá los datos de la ficha comercial de la propiedad"
                  : "Registrá una nueva propiedad bajo tu gestión comercial"}
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCerrar}
              aria-label="Cerrar"
              disabled={guardando}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-light">
            {errores.global && (
              <div className="alert alert-danger rounded-3 small py-2 mb-3">
                {errores.global}
              </div>
            )}

            <form id="form-inmueble-agente" onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Título de la propiedad */}
                <FormInput
                  id="titulo"
                  name="titulo"
                  label="Título de la publicación"
                  placeholder="Ej. Casa moderna con jardín y pileta"
                  value={formData.titulo}
                  onChange={handleChange}
                  error={errores.titulo}
                  className="col-12"
                  required
                />

                {/* Dirección y Zona */}
                <FormInput
                  id="direccion"
                  name="direccion"
                  label="Dirección"
                  placeholder="Ej. Av. Santa Fe 3400"
                  value={formData.direccion}
                  onChange={handleChange}
                  error={errores.direccion}
                  className="col-md-7"
                  required
                />

                <FormInput
                  id="zona"
                  name="zona"
                  label="Zona / Barrio"
                  placeholder="Ej. Palermo, Belgrano, Tigre"
                  value={formData.zona}
                  onChange={handleChange}
                  error={errores.zona}
                  className="col-md-5"
                  required
                />

                {/* Categoría, Operación y Visibilidad */}
                <div className="col-md-4">
                  <label
                    htmlFor="categoria"
                    className="form-label small fw-medium text-secondary"
                  >
                    Categoría
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    className="form-select rounded-3 py-2"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    {CATEGORIAS_INMUEBLE.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="estado_comercial"
                    className="form-label small fw-medium text-secondary"
                  >
                    Operación
                  </label>
                  <select
                    id="estado_comercial"
                    name="estado_comercial"
                    className="form-select rounded-3 py-2"
                    value={formData.estado_comercial}
                    onChange={handleChange}
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label
                    htmlFor="estado_visibilidad"
                    className="form-label small fw-medium text-secondary"
                  >
                    Visibilidad
                  </label>
                  <select
                    id="estado_visibilidad"
                    name="estado_visibilidad"
                    className="form-select rounded-3 py-2"
                    value={formData.estado_visibilidad}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Propietario Opcional */}
                <div className="col-12">
                  <label
                    htmlFor="propietario_id"
                    className="form-label small fw-medium text-secondary"
                  >
                    Propietario (Opcional)
                  </label>
                  <select
                    id="propietario_id"
                    name="propietario_id"
                    className="form-select rounded-3 py-2"
                    value={formData.propietario_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Sin propietario asignado --</option>
                    {propietarios.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} {p.apellido || ""} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Moneda, Precio y Expensas */}
                <div className="col-md-3">
                  <label
                    htmlFor="moneda"
                    className="form-label small fw-medium text-secondary"
                  >
                    Moneda
                  </label>
                  <select
                    id="moneda"
                    name="moneda"
                    className="form-select rounded-3 py-2"
                    value={formData.moneda}
                    onChange={handleChange}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ARS">ARS ($)</option>
                  </select>
                </div>

                <FormInput
                  id="precio"
                  name="precio"
                  label={
                    formData.estado_comercial === "alquiler"
                      ? "Precio Alquiler (/mes)"
                      : "Precio Venta"
                  }
                  type="number"
                  placeholder="Ej. 180000"
                  value={formData.precio}
                  onChange={handleChange}
                  error={errores.precio}
                  className={
                    formData.estado_comercial === "alquiler"
                      ? "col-md-5"
                      : "col-md-9"
                  }
                  required
                />

                {formData.estado_comercial === "alquiler" && (
                  <FormInput
                    id="expensas"
                    name="expensas"
                    label="Expensas (Opcional)"
                    type="number"
                    placeholder="Ej. 25000"
                    value={formData.expensas}
                    onChange={handleChange}
                    className="col-md-4"
                  />
                )}

                {/* Ambientes, Baños y m² */}
                <FormInput
                  id="ambientes"
                  name="ambientes"
                  label="Ambientes"
                  type="number"
                  value={formData.ambientes}
                  onChange={handleChange}
                  className="col-md-4"
                />

                <FormInput
                  id="banos"
                  name="banos"
                  label="Baños"
                  type="number"
                  value={formData.banos}
                  onChange={handleChange}
                  className="col-md-4"
                />

                <FormInput
                  id="m2"
                  name="m2"
                  label="Superficie (m²)"
                  type="number"
                  value={formData.m2}
                  onChange={handleChange}
                  error={errores.m2}
                  className="col-md-4"
                  required
                />

                {/* Archivos Fisicos de Fotos */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Imágenes del Inmueble
                  </label>
                  <input
                    id="imagenes"
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-control rounded-3 py-2"
                    onChange={handleFileChange}
                  />
                  {errores.imagenes ? (
                    <div className="invalid-feedback d-block mt-1 fw-medium">
                      {errores.imagenes}
                    </div>
                  ) : (
                    <small className="text-muted d-block mt-1">
                      Podés seleccionar una o varias imágenes.
                    </small>
                  )}
                </div>

                {/* Galería de Previsualización */}
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {/*img que estan en la bd*/}
                  {imagenesExistentes.map((img) => (
                    <div
                      key={`existente-${img.id}`}
                      className="position-relative"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <img
                        src={obtenerUrlImagen(img.url)}
                        alt="Existente"
                        className="w-100 h-100 rounded object-fit-cover border"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "22px",
                          height: "22px",
                          transform: "translate(30%, -30%)",
                        }}
                        onClick={() => handleRemoveImage(img, true)}
                        title="Eliminar de la base de datos"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  {/*img seleccionadas*/}
                  {previewsLocales.map((item, index) => (
                    <div
                      key={`local-${index}`}
                      className="position-relative"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <img
                        src={item.url}
                        alt="Previsualización"
                        className="w-100 h-100 rounded object-fit-cover border border-primary"
                      />
                      <button
                        type="button"
                        className="btn btn-dark btn-sm position-absolute top-0 end-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "22px",
                          height: "22px",
                          transform: "translate(30%, -30%)",
                        }}
                        onClick={() => handleRemoveImage(item, false)}
                        title="Quitar de la lista"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label
                    htmlFor="descripcion"
                    className="form-label small fw-medium text-secondary"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="3"
                    className="form-control rounded-3 py-2"
                    placeholder="Detalles de la propiedad..."
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-white px-4 py-3">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-inmueble-agente"
              className="btn btn-primary rounded-pill px-4 fw-medium"
              style={{ backgroundColor: "#13284c", borderColor: "#13284c" }}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Guardando...
                </>
              ) : esEdicion ? (
                "Guardar Cambios"
              ) : (
                "+ Publicar Inmueble"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
