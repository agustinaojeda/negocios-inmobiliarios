import { useOutletContext } from 'react-router'
import InformacionContacto from '../components/InfoContacto'
import Favoritos from '../components/Favoritos'
import AlertasPrecio from '../components/AlertasPrecio'
import Citas from '../components/Citas'
import InmueblesAsignados from '../components/InmueblesAsignados'
import Seguridad from '../components/Seguridad'

export default function InquilinoPage() {
  const { seccionActiva, sesion } = useOutletContext()

  return (
    <div>
      {seccionActiva === 'contacto' && (<InformacionContacto />
      )}

      {seccionActiva === 'favoritos' && (<Favoritos />
      )}

      {seccionActiva === 'citas' && (<Citas />
      )}

      {seccionActiva === 'alertas' && (<AlertasPrecio />
      )}

      {seccionActiva === 'asignados' && (<InmueblesAsignados />
      )}

      {seccionActiva === 'seguridad' && (<Seguridad />
      )}
    </div>
  )
}