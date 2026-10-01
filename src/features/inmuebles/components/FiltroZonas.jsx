function FiltroZonas({ zonas, seleccionada, onSeleccionar }) {
  return (
    <div className="mb-4">
      <label htmlFor="filtro-zona" className="form-label fw-bold">
        Zona / Barrio
      </label>
      <select
        id="filtro-zona"
        className="form-select px-3 form-select-sm rounded-3"
        value={seleccionada}
        onChange={(e) => onSeleccionar(e.target.value)}
      >
        <option value="todas">Todas las zonas</option>
        {zonas.map((zona) => (
          <option key={zona} value={zona}>
            {zona}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FiltroZonas