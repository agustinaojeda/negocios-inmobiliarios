import PropertyCard from './PropertyCard'

function GrillaPropiedades({ propiedades, citas, esCita=false, esAsignado = false, renderAccion = null, renderCard = null }) {
  const lista = citas || propiedades || [];
  const esModoCita = esCita || Boolean(citas);

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4 grilla-propiedades">
      {lista.map((item) => {
        const tarjeta = renderCard
          ? renderCard(item)
          : esModoCita
            ? <PropertyCard cita={item} />
            : <PropertyCard property={item} esAsignado={esAsignado} />;
        const accion = renderAccion ? renderAccion(item) : null;

        return (
          <div className="col" key={item.id}>
            {accion ? (
              <div className="d-flex flex-column h-100">
                <div className="flex-grow-1">{tarjeta}</div>
                <div className="d-flex justify-content-end mt-2">{accion}</div>
              </div>
            ) : (
              tarjeta
            )}
          </div>
        );
      })}
    </div>
  )
}

export default GrillaPropiedades
