import { pool } from '../../config/db.js';

// Metricas globales del sistema (para Administradores)
export const obtenerMetricasAdmin = async () => {
    // 1. Usuarios e inventario de agentes
    const qUsuarios = `
    SELECT 
      COUNT(*)::INTEGER AS total_usuarios,
      COUNT(*) FILTER (WHERE esta_activo = true)::INTEGER AS usuarios_activos,
      (
        SELECT COUNT(*)::INTEGER 
        FROM usuario_roles ur 
        INNER JOIN roles r ON ur.rol_id = r.id_rol 
        INNER JOIN usuarios u ON ur.usuario_id = u.id 
        WHERE r.nombre = 'agente' AND u.esta_activo = true
      ) AS agentes_operativos
    FROM usuarios;
  `;

    // Inmuebles (activos vs inactivos)
    const qInmuebles = `
    SELECT 
      COUNT(*)::INTEGER AS total_inmuebles,
      COUNT(*) FILTER (WHERE estado_visibilidad = 'activo' AND fecha_baja IS NULL)::INTEGER AS inmuebles_activos,
      COUNT(*) FILTER (WHERE estado_visibilidad = 'inactivo' OR fecha_baja IS NOT NULL)::INTEGER AS inmuebles_inactivos
    FROM propiedades;
  `;

    // Operaciones y volumen total transaccionado
    const qOperaciones = `
    SELECT 
      COUNT(*)::INTEGER AS total_operaciones,
      COALESCE(SUM(monto_cierre) FILTER (WHERE moneda = 'USD'), 0)::NUMERIC AS volumen_usd,
      COALESCE(SUM(monto_cierre) FILTER (WHERE moneda = 'ARS'), 0)::NUMERIC AS volumen_ars
    FROM operaciones;
  `;

    // Citas (totales, pendientes y vencidas)
    const qCitas = `
    SELECT 
      COUNT(*)::INTEGER AS total_citas,
      COUNT(*) FILTER (WHERE estado = 'pendiente')::INTEGER AS citas_pendientes,
      COUNT(*) FILTER (WHERE estado = 'pendiente' AND fecha < CURRENT_DATE)::INTEGER AS citas_vencidas,
      COUNT(*) FILTER (WHERE estado = 'confirmada')::INTEGER AS citas_confirmadas,
      COUNT(*) FILTER (WHERE estado = 'completada')::INTEGER AS citas_completadas
    FROM citas;
  `;

    // Comparativa de ventas por agente
    const qVentasAgente = `
    SELECT 
      u.id AS agente_id,
      CONCAT(u.nombre, ' ', u.apellido) AS agente_nombre,
      COUNT(o.id)::INTEGER AS operaciones_cerradas,
      COALESCE(SUM(o.monto_cierre), 0)::NUMERIC AS volumen_total
    FROM usuarios u
    INNER JOIN usuario_roles ur ON u.id = ur.usuario_id
    INNER JOIN roles r ON ur.rol_id = r.id_rol
    LEFT JOIN propiedades p ON p.agente_id = u.id
    LEFT JOIN operaciones o ON o.propiedad_id = p.id
    WHERE r.nombre = 'agente' AND u.esta_activo = true
    GROUP BY u.id, u.nombre, u.apellido
    ORDER BY volumen_total DESC;
  `;

    // Inmuebles estancados (más de 30 días publicados sin visitas recientes)
    const qEstancados = `
    SELECT 
      p.id, 
      p.titulo, 
      p.precio, 
      p.moneda, 
      p.zona,
      EXTRACT(DAY FROM NOW() - p.fecha_creacion)::INTEGER AS dias_publicada
    FROM propiedades p
    WHERE p.estado_visibilidad = 'activo' 
      AND p.fecha_baja IS NULL
      AND p.fecha_creacion < (NOW() - INTERVAL '30 days')
      AND NOT EXISTS (
        SELECT 1 FROM citas c 
        WHERE c.propiedad_id = p.id 
          AND c.fecha_creacion > (NOW() - INTERVAL '30 days')
      )
    ORDER BY p.fecha_creacion ASC
    LIMIT 5;
  `;

    // Ejecutamos las consultas en paralelo
    const [
        resUsuarios,
        resInmuebles,
        resOperaciones,
        resCitas,
        resVentasAgente,
        resEstancados,
    ] = await Promise.all([
        pool.query(qUsuarios),
        pool.query(qInmuebles),
        pool.query(qOperaciones),
        pool.query(qCitas),
        pool.query(qVentasAgente),
        pool.query(qEstancados),
    ]);

    return {
        usuarios: resUsuarios.rows[0],
        inmuebles: resInmuebles.rows[0],
        operaciones: resOperaciones.rows[0],
        citas: resCitas.rows[0],
        ventasPorAgente: resVentasAgente.rows,
        inmueblesEstancados: resEstancados.rows,
    };
};

// Métricas individuales del agente asignado
export const obtenerMetricasAgente = async (agenteId) => {
    // Inmuebles asignados al agente
    const qInmuebles = `
    SELECT 
      COUNT(*)::INTEGER AS total_inmuebles,
      COUNT(*) FILTER (WHERE estado_visibilidad = 'activo' AND fecha_baja IS NULL)::INTEGER AS inmuebles_activos,
      COUNT(*) FILTER (WHERE estado_visibilidad = 'inactivo' OR fecha_baja IS NOT NULL)::INTEGER AS inmuebles_inactivos
    FROM propiedades
    WHERE agente_id = $1;
  `;

    // Operaciones cerradas por el agente
    const qOperaciones = `
    SELECT 
      COUNT(o.id)::INTEGER AS total_operaciones,
      COALESCE(SUM(o.monto_cierre) FILTER (WHERE o.moneda = 'USD'), 0)::NUMERIC AS volumen_usd,
      COALESCE(SUM(o.monto_cierre) FILTER (WHERE o.moneda = 'ARS'), 0)::NUMERIC AS volumen_ars
    FROM operaciones o
    INNER JOIN propiedades p ON o.propiedad_id = p.id
    WHERE p.agente_id = $1;
  `;

    // Citas agendadas en inmuebles del agente
    const qCitas = `
    SELECT 
      COUNT(c.id)::INTEGER AS total_citas,
      COUNT(*) FILTER (WHERE c.estado = 'pendiente')::INTEGER AS citas_pendientes,
      COUNT(*) FILTER (WHERE c.estado = 'pendiente' AND c.fecha < CURRENT_DATE)::INTEGER AS citas_vencidas,
      COUNT(*) FILTER (WHERE c.estado = 'confirmada')::INTEGER AS citas_confirmadas,
      COUNT(*) FILTER (WHERE c.estado = 'completada')::INTEGER AS citas_completadas
    FROM citas c
    INNER JOIN propiedades p ON c.propiedad_id = p.id
    WHERE p.agente_id = $1;
  `;

    // Inmuebles estancados del agente
    const qEstancados = `
    SELECT 
      p.id, 
      p.titulo, 
      p.precio, 
      p.moneda, 
      p.zona,
      EXTRACT(DAY FROM NOW() - p.fecha_creacion)::INTEGER AS dias_publicada
    FROM propiedades p
    WHERE p.agente_id = $1
      AND p.estado_visibilidad = 'activo' 
      AND p.fecha_baja IS NULL
      AND p.fecha_creacion < (NOW() - INTERVAL '30 days')
    ORDER BY p.fecha_creacion ASC
    LIMIT 5;
  `;

    const [resInmuebles, resOperaciones, resCitas, resEstancados] = await Promise.all([
        pool.query(qInmuebles, [agenteId]),
        pool.query(qOperaciones, [agenteId]),
        pool.query(qCitas, [agenteId]),
        pool.query(qEstancados, [agenteId]),
    ]);

    return {
        inmuebles: resInmuebles.rows[0],
        operaciones: resOperaciones.rows[0],
        citas: resCitas.rows[0],
        inmueblesEstancados: resEstancados.rows,
    };
};
