export default function HomePage() {
  return (
    <section className="container py-5 mt-5">
      <div className="row align-items-center gy-4">
        <div className="col-lg-6">
          <span className="badge bg-warning text-dark mb-3">Negocios Inmobiliarios</span>
          <h1 className="display-5 fw-bold">Tu propiedad, mejor gestionada.</h1>
          <p className="lead text-secondary">
            Gestionamos alquileres, ventas y relaciones entre propietarios e inquilinos de forma simple y profesional.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <a href="/login" className="btn btn-warning btn-lg">Iniciar sesión</a>
            <a href="/inmuebles" className="btn btn-outline-dark btn-lg">Ver propiedades</a>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4">
            <div className="row g-3">
              <div className="col-6">
                <div className="bg-light rounded p-3 h-100">
                  <small className="text-secondary d-block">Propiedades activas</small>
                  <strong className="fs-3">128</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light rounded p-3 h-100">
                  <small className="text-secondary d-block">Contratos</small>
                  <strong className="fs-3">96</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light rounded p-3 h-100">
                  <small className="text-secondary d-block">Propietarios</small>
                  <strong className="fs-3">84</strong>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light rounded p-3 h-100">
                  <small className="text-secondary d-block">Inquilinos</small>
                  <strong className="fs-3">71</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
