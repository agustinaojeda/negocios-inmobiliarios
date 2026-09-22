import TarjetaPropiedad from './TarjetaPropiedad'

function GrillaPropiedades({ propiedades, onConsultar }) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 grilla-propiedades">
      {propiedades.map((propiedad) => (
        <div className="col" key={propiedad.id}>
          <TarjetaPropiedad propiedad={propiedad} onConsultar={onConsultar} />
        </div>
      ))}
    </div>
  )
}

export default GrillaPropiedades