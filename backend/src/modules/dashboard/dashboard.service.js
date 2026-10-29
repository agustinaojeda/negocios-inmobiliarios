import * as repository from './dashboard.repository.js';

export const obtenerMetricas = async (usuario) => {
    // Validar permisos: solo admin o agente
    if (usuario.rol !== 'admin' && usuario.rol !== 'agente') {
        return {
            forbidden: true,
            mensaje: 'Acceso denegado: se requiere rol de administrador o agente para ver el dashboard',
        };
    }

    // Si es ADMIN: métricas globales de toda la plataforma
    if (usuario.rol === 'admin') {
        const data = await repository.obtenerMetricasAdmin();

        const totalCitas = Number(data.citas.total_citas);
        const totalOperaciones = Number(data.operaciones.total_operaciones);

        // Tasa de conversión de visitas a operaciones cerradas acotada al 100 por pruebas en postman
        const tasaConversion = totalCitas > 0
            ? Math.min(100, Number(((totalOperaciones / totalCitas) * 100).toFixed(1)))
            : 0;


        return {
            rol: 'admin',
            usuarios: data.usuarios,
            inmuebles: data.inmuebles,
            operaciones: data.operaciones,
            citas: data.citas,
            kpis: {
                tasaConversion,
                citasVencidas: data.citas.citas_vencidas,
                inmueblesEstancadosCount: data.inmueblesEstancados.length,
            },
            ventasPorAgente: data.ventasPorAgente,
            inmueblesEstancados: data.inmueblesEstancados,
        };
    }

    // Si es agente: metricas personales de su cartera y citas asignadas
    const data = await repository.obtenerMetricasAgente(usuario.id);

    const totalCitas = Number(data.citas.total_citas);
    const totalOperaciones = Number(data.operaciones.total_operaciones);

    // Tasa de conversión acotada a un máximo de 100% p pruebas en postman
    const tasaConversion = totalCitas > 0
        ? Math.min(100, Number(((totalOperaciones / totalCitas) * 100).toFixed(1)))
        : 0;


    return {
        rol: 'agente',
        inmuebles: data.inmuebles,
        operaciones: data.operaciones,
        citas: data.citas,
        kpis: {
            tasaConversion,
            citasVencidas: data.citas.citas_vencidas,
            inmueblesEstancadosCount: data.inmueblesEstancados.length,
        },
        inmueblesEstancados: data.inmueblesEstancados,
    };
};
