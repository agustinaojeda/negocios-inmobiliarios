import PropertyCard from './PropertyCard'

function GrillaPropiedades({ propiedades, citas, esCita=false, esAsignado = false }) {
  const lista = citas || propiedades || [];
  const esModoCita = esCita || Boolean(citas);

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 grilla-propiedades">
      {lista.map((item) => (
        <div className="col" key={item.id}>
          {esModoCita ? (
            <PropertyCard cita={item} />
          ) : (
            <PropertyCard property={item} esAsignado={esAsignado} />
          )}
        </div>
      ))}
    </div>
  )
}

export default GrillaPropiedades