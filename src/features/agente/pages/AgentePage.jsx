import { useOutletContext } from 'react-router'
import CarteraInmuebles from '../components/CarteraInmuebles'
import AgendaVisitas from '../components/AgendaVisitas'
import DesempenoAgente from '../components/DesempenoAgente'
import InformacionContacto from '../../../shared/components/panel/InfoContacto'
import Seguridad from '../../../shared/components/panel/Seguridad'

export default function AgentePage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'cartera' && (
        <CarteraInmuebles agenteId={sesion?.id} />
      )}

      {seccionActiva === 'citas' && (
        <AgendaVisitas agenteId={sesion?.id} />
      )}

      {seccionActiva === 'clientes' && (
        <DesempenoAgente agenteId={sesion?.id} />
      )}

      {seccionActiva === 'consultas' && (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3" style={{ color: '#13284c' }}>
            Consultas y Mensajes Directos
          </h2>
          <p className="text-muted">
            Mensajes recibidos desde las fichas comerciales de tus propiedades publicadas.
          </p>
          <div className="alert alert-light border rounded-3 text-muted small mt-2">
            No tenés nuevas consultas sin responder en este momento.
          </div>
        </div>
      )}

      {seccionActiva === 'perfil' && (
        <InformacionContacto />
      )}

      {seccionActiva === 'seguridad' && (
        <Seguridad />
      )}
    </div>
  )
}
