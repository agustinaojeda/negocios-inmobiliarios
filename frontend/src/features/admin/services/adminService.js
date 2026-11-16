import { apiClient } from '../../../shared/services/apiClient';

// Obtener métricas y KPIs para el dashboard (Admin o Agente)
export async function obtenerMetricasDashboard() {
    return apiClient.get('/dashboard');
}

// Obtener listado de contratos/operaciones comerciales cerradas.
// Se reutiliza el service compartido para no duplicar la llamada.
export { listarOperaciones as obtenerOperaciones } from '../../../shared/services/operacionesService';
