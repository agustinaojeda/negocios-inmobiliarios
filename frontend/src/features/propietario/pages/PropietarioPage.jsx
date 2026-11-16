import { useOutletContext } from 'react-router'
import InformacionContacto from '../../../shared/components/panel/InfoContacto'
import Seguridad from '../../../shared/components/panel/Seguridad'
import MetricasProp from '../components/MetricasProp'
import MisPropiedades from '../components/MisPropiedades'
import OperacionesPropietario from '../components/OperacionesPropietario'

export default function PropietarioPage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'propiedades' && (<MisPropiedades />
      )}

      {seccionActiva === 'operaciones' && (<OperacionesPropietario />
      )}

      {seccionActiva === 'metricas' && (<MetricasProp />
      )}

      {seccionActiva === 'contacto' && (<InformacionContacto />
      )}

      {seccionActiva === 'seguridad' && (<Seguridad />
      )}
    </div>
  )
}
