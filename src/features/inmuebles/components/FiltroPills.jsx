//filtro para tipos y categorias, tienen el mismo diseño visual
//tipo = todas - alquiler - venta
//categoria = casa - departamento - ph
import { capitalizar } from "../../../shared/utils/formato";

export default function FiltroPills({ titulo, opciones = [], seleccionado, onSeleccionar }) {
  const opcionesSinTodas = opciones.filter((opcion) => opcion !== 'todas')

  return (
    <div className="mb-4">
      <span className="form-label fw-bold d-block mb-2">{titulo}</span>
      <div className="d-flex flex-wrap gap-2">
        {/*boton para seleccionar todas */}
        <button
          type="button"
          className={`btn btn-sm rounded-pill ${
            seleccionado === 'todas' ? 'btn-dark' : 'btn-outline-secondary'
          }`}
          onClick={() => onSeleccionar('todas')}
        >
          Todas
        </button>

        {/*demas botones con las otras opciones (venta - alquiler o casa - depto - ph)*/}
        {opcionesSinTodas.map((opcion) => {
          const activo = opcion === seleccionado
          return (
            <button
              key={opcion}
              type="button"
              className={`btn btn-sm rounded-pill ${
                activo ? 'btn-dark' : 'btn-outline-secondary'
              }`}
              onClick={() => onSeleccionar(opcion)}
            >
              {capitalizar(opcion)}
            </button>
          )
        })}
      </div>
    </div>
  )
}