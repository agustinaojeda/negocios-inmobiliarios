export default function NoAutorizado() {
    return (
        <section className="container py-5 mt-5 text-center">
            <h1 className="display-4 fw-bold">403</h1>
            <p className="lead text-secondary">No tienes permisos para acceder a esta página.</p>
            <a href="/" className="btn btn-warning">Volver al inicio</a>
        </section>
    )
}
