import { apiClient } from '../../../shared/services/apiClient';

// Obtener métricas y KPIs para el dashboard (Admin o Agente)
export async function obtenerMetricasDashboard() {
    return apiClient.get('/dashboard');
}

// Obtener listado de contratos/operaciones comerciales cerradas
export async function obtenerOperaciones() {
    const respuesta = await apiClient.get('/operaciones');
    return respuesta.operaciones || [];
}
