import GrillaPropiedades from "../components/GrillaPropiedades";
import FiltroZonas from "../components/FiltroZonas";
import FiltroPills from "../components/FiltroPills";
import FiltroBusqueda from "../components/FiltroBusqueda";
import { useFiltros } from "../hooks/useFiltros";
import { obtenerPropiedadesDisponibles } from "../services/inmueblesService";
import { useFetch } from "../../../shared/hooks/useFetch";
import Boton from "../../../shared/components/Boton";
import Spinner from "../../../shared/components/Spinner";
import MensajeVacio from "../../../shared/components/MensajeVacio";
import heroImg from "../../../assets/hero.jpg";

function InmueblesPage() {
  const {
    datos: propiedades = [],
    cargando,
    error,
  } = useFetch(obtenerPropiedadesDisponibles);

  const filtros = useFiltros(propiedades);

  if (cargando) return <Spinner texto="Cargando propiedades..." />;
  if (error)
    return (
      <MensajeVacio
        titulo="No pudimos cargar las propiedades"
        texto={error.message || error}
      />
    );

  const imagenFondo = heroImg;

  return (
    <>
      <header
        className="hero-header mb-5 p-4 p-md-5 text-white rounded-4 shadow position-relative overflow-hidden text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.50)), url("${imagenFondo}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "360px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container-fluid py-3">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold mb-2">
                Encontrá tu próximo hogar
              </h1>
              <p className="lead text-white-50 mb-0">
                Filtrá por tipo de operación, inmueble o zona.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <FiltroBusqueda
                busqueda={filtros.busqueda}
                onBuscar={filtros.setBusqueda}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mb-4">
        <div className="row g-5">
          {/**filtros */}
          <aside className="col-lg-3 filtros">
            <FiltroPills
              titulo="Tipo de operación"
              opciones={filtros.tipos}
              seleccionado={filtros.tipo}
              onSeleccionar={filtros.setTipo}
            />

            <FiltroPills
              titulo="Categoría"
              opciones={filtros.categorias}
              seleccionado={filtros.categoria}
              onSeleccionar={filtros.setCategoria}
            />

            <FiltroZonas
              zonas={filtros.zonas}
              seleccionada={filtros.zona}
              onSeleccionar={filtros.setZona}
            />

            {filtros.hayFiltrosActivos && (
              <Boton
                variante="outline-secondary"
                tamanio="sm"
                className="btn-limpiar-tag w-100 mt-2"
                onClick={filtros.limpiarFiltros}
              >
                Limpiar filtros
              </Boton>
            )}
          </aside>
          
          {/**grilla de propiedades */}
          <section className="col-lg-9" style={{ paddingTop: 0 }}>
            <p className="small text-body-secondary">
              Mostrando {filtros.propiedadesFiltradas?.length ?? 0} de{" "}
              {propiedades?.length ?? 0} propiedades
            </p>

            {filtros.propiedadesFiltradas?.length > 0 ? (
              <GrillaPropiedades propiedades={filtros.propiedadesFiltradas} />
            ) : (
              <MensajeVacio
                titulo="No se encontraron propiedades"
                texto="Probá cambiando o limpiando los filtros seleccionados."
              >
                <Boton onClick={filtros.limpiarFiltros}>Ver todo</Boton>
              </MensajeVacio>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default InmueblesPage;
