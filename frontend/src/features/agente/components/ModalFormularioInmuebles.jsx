import { useState, useEffect } from 'react'
import FormInput from '../../../shared/components/panel/FormInput'

const ESTADOS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'alquilado', label: 'Alquilado' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'pausado', label: 'Pausado' },
]

const CATEGORIAS = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'ph', label: 'PH' },
  { value: 'terreno', label: 'Terreno / Lote' },
  { value: 'local', label: 'Local Comercial' },
]

const FORM_INICIAL = {
  titulo: '',
  direccion: '',
  zona: '',
  precio: '',
  unit: '',
  categoria: 'departamento',
  tipo: 'venta',
  estado: 'disponible',
  amb: 2,
  banos: 1,
  m2: 50,
  img: '',
  desc: '',
}

export default function ModalFormularioInmuebles({
  mostrar,
  onCerrar,
  onGuardar,
  propiedadEditar = null,
}) {
  const [formData, setFormData] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const esEdicion = Boolean(propiedadEditar)

  useEffect(() => {
    if (propiedadEditar) {
      setFormData({
        titulo: propiedadEditar.titulo || '',
        direccion: propiedadEditar.direccion || '',
        zona: propiedadEditar.zona || '',
        precio: propiedadEditar.precio || '',
        unit: propiedadEditar.unit || (propiedadEditar.tipo === 'alquiler' ? '/mes' : ''),
        categoria: propiedadEditar.categoria || 'departamento',
        tipo: propiedadEditar.tipo || 'venta',
        estado: propiedadEditar.estado || 'disponible',
        amb: propiedadEditar.amb || 1,
        banos: propiedadEditar.banos || 1,
        m2: propiedadEditar.m2 || 0,
        img: propiedadEditar.img || '',
        desc: propiedadEditar.desc || '',
      })
    } else {
      setFormData(FORM_INICIAL)
    }
    setErrores({})
  }, [propiedadEditar, mostrar])

  if (!mostrar) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'tipo' && value === 'alquiler' && !prev.unit ? { unit: '/mes' } : {}),
      ...(name === 'tipo' && value === 'venta' && prev.unit === '/mes' ? { unit: '' } : {}),
    }))

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!formData.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio'
    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria'
    if (!formData.zona.trim()) nuevosErrores.zona = 'La zona/barrio es obligatoria'
    if (!formData.precio || Number(formData.precio) <= 0) {
      nuevosErrores.precio = 'Ingresá un precio válido mayor a 0'
    }
    if (!formData.m2 || Number(formData.m2) <= 0) {
      nuevosErrores.m2 = 'Ingresá los m² totales'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setGuardando(true)
    try {
      await onGuardar({
        ...formData,
        id: propiedadEditar?.id,
      })
      onCerrar()
    } catch (err) {
      console.error('Error al guardar propiedad:', err)
      setErrores({ global: err.message || 'Ocurrió un error al guardar' })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1055 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="modal-header border-0 text-white px-4 py-3"
            style={{ backgroundColor: '#13284c' }}
          >
            <div>
              <h5 className="modal-title fw-bold mb-0">
                {esEdicion ? 'Editar Inmueble Asignado' : 'Captar Nuevo Inmueble'}
              </h5>
              <small className="opacity-75">
                {esEdicion
                  ? 'Actualizá los datos de la ficha comercial de la propiedad'
                  : 'Registrá una nueva propiedad bajo tu gestión comercial'}
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

                {/* Categoría y Tipo de Operación */}
                <div className="col-md-4">
                  <label htmlFor="categoria" className="form-label small fw-medium text-secondary">
                    Categoría
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    className="form-select rounded-3 py-2"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="tipo" className="form-label small fw-medium text-secondary">
                    Tipo de Operación
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    className="form-select rounded-3 py-2"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="venta">Venta</option>
                    <option value="alquiler">Alquiler</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label htmlFor="estado" className="form-label small fw-medium text-secondary">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-select rounded-3 py-2"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Precio y Unidad */}
                <FormInput
                  id="precio"
                  name="precio"
                  label="Precio"
                  type="number"
                  placeholder="Ej. 180000"
                  value={formData.precio}
                  onChange={handleChange}
                  error={errores.precio}
                  className="col-md-6"
                  required
                />

                <FormInput
                  id="unit"
                  name="unit"
                  label="Unidad / Periodicidad"
                  placeholder="Dejar vacío para venta o '/mes' para alquiler"
                  value={formData.unit}
                  onChange={handleChange}
                  className="col-md-6"
                />

                {/* Ambientes, Baños y Superficie */}
                <FormInput
                  id="amb"
                  name="amb"
                  label="Ambientes"
                  type="number"
                  value={formData.amb}
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
                  label="Superficie Total (m²)"
                  type="number"
                  value={formData.m2}
                  onChange={handleChange}
                  error={errores.m2}
                  className="col-md-4"
                  required
                />

                {/* Imagen */}
                <FormInput
                  id="img"
                  name="img"
                  label="URL de la Imagen / Foto principal"
                  placeholder="Ej. /img/propiedades/prop1.jpg o https://..."
                  value={formData.img}
                  onChange={handleChange}
                  className="col-12"
                />

                {formData.img && (
                  <div className="col-12 text-center my-1">
                    <img
                      src={formData.img}
                      alt="Vista previa"
                      className="rounded-3 shadow-sm object-fit-cover border"
                      style={{ height: '140px', width: '220px' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Descripción */}
                <div className="col-12">
                  <label htmlFor="desc" className="form-label small fw-medium text-secondary">
                    Descripción del Inmueble
                  </label>
                  <textarea
                    id="desc"
                    name="desc"
                    rows="3"
                    className="form-control rounded-3 py-2"
                    placeholder="Detalles sobre luminosidad, balcón, cochera, amenities..."
                    value={formData.desc}
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
              style={{ backgroundColor: '#13284c', borderColor: '#13284c' }}
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Guardando...
                </>
              ) : esEdicion ? (
                'Guardar Cambios'
              ) : (
                '+ Publicar Inmueble'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
