import { apiClient } from './apiClient'

export async function listarOperaciones() {
  const respuesta = await apiClient.get('/operaciones')
  return respuesta.operaciones || []
}

export async function obtenerOperacionDetalle(id) {
  return apiClient.get(`/operaciones/${id}`)
}

export async function crearOperacion({
  propiedadId,
  clienteId,
  moneda,
  montoCierre,
  fechaInicioContrato,
  fechaFinContrato,
}) {
  return apiClient.post('/operaciones', {
    propiedadId: Number(propiedadId),
    clienteId: Number(clienteId),
    moneda,
    montoCierre: Number(montoCierre),
    fechaInicioContrato: fechaInicioContrato || undefined,
    fechaFinContrato: fechaFinContrato || undefined,
  })
}
