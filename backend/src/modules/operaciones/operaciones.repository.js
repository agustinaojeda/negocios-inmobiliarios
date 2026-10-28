import { pool } from '../../config/db.js';

// Consulta base con JOINs para traer la información completa de la operación
const QUERY_BASE_OPERACIONES = `
  SELECT 
    o.id,
    o.propiedad_id,
    o.cliente_id,
    o.moneda,
    o.monto_cierre,
    o.fecha_operacion,
    o.fecha_inicio_contrato,
    o.fecha_fin_contrato,
    -- Datos del inmueble
    p.titulo AS propiedad_titulo,
    p.direccion AS propiedad_direccion,
    p.zona AS propiedad_zona,
    p.categoria AS propiedad_categoria,
    p.estado_comercial AS tipo_operacion,
    p.propietario_id,
    p.agente_id,
    (
      SELECT url FROM imagenes_propiedades 
      WHERE propiedad_id = p.id AND es_principal = true 
      LIMIT 1
    ) AS propiedad_img,
    -- Datos del cliente (comprador o inquilino)
    u_cli.nombre AS cliente_nombre,
    u_cli.apellido AS cliente_apellido,
    u_cli.email AS cliente_email,
    u_cli.telefono AS cliente_telefono,
    -- Datos del propietario
    u_prop.nombre AS propietario_nombre,
    u_prop.apellido AS propietario_apellido,
    -- Datos del asesor/agente
    u_age.nombre AS agente_nombre,
    u_age.apellido AS agente_apellido
  FROM operaciones o
  INNER JOIN propiedades p ON o.propiedad_id = p.id
  INNER JOIN usuarios u_cli ON o.cliente_id = u_cli.id
  LEFT JOIN usuarios u_prop ON p.propietario_id = u_prop.id
  LEFT JOIN usuarios u_age ON p.agente_id = u_age.id
`;

// Crear una nueva operación y desactivar la propiedad comercialmente
export const crear = async ({
    propiedadId,
    clienteId,
    moneda,
    montoCierre,
    fechaInicioContrato,
    fechaFinContrato,
}) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insertar el registro de la operación
        const queryOperacion = `
      INSERT INTO operaciones (
        propiedad_id,
        cliente_id,
        moneda,
        monto_cierre,
        fecha_inicio_contrato,
        fecha_fin_contrato
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
        const { rows } = await client.query(queryOperacion, [
            propiedadId,
            clienteId,
            moneda,
            montoCierre,
            fechaInicioContrato || null,
            fechaFinContrato || null,
        ]);

        // como reegla de negocio desactivar la visibilidad del inmueble al concretarse la operación
        await client.query(
            `UPDATE propiedades 
       SET estado_visibilidad = 'inactivo', fecha_actualizacion = CURRENT_TIMESTAMP 
       WHERE id = $1`,
            [propiedadId]
        );

        await client.query('COMMIT');
        return rows[0] || null;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Obtener una operación puntual por ID
export const obtenerPorId = async (id) => {
    const query = `${QUERY_BASE_OPERACIONES} WHERE o.id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
};

// Obtener todas las operaciones filtrando por rol y parámetro opcional tipo (?tipo=alquiler o venta)
export const obtenerTodas = async ({ usuario, tipo }) => {
    let query = QUERY_BASE_OPERACIONES;
    const conditions = [];
    const params = [];

    // Filtro según el rol del usuario autenticado
    if (usuario.rol === 'agente') {
        params.push(usuario.id);
        conditions.push(`p.agente_id = $${params.length}`);
    } else if (usuario.rol === 'propietario') {
        params.push(usuario.id);
        conditions.push(`p.propietario_id = $${params.length}`);
    } else if (usuario.rol === 'inquilino') {
        params.push(usuario.id);
        conditions.push(`o.cliente_id = $${params.length}`);
    }
    // Si es 'admin', no agrega restricción de usuario y puede ver todas

    // Filtro opcional por tipo de operación (?tipo=alquiler o ?tipo=venta)
    if (tipo) {
        params.push(tipo.toLowerCase());
        conditions.push(`LOWER(p.estado_comercial) = $${params.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY o.fecha_operacion DESC;`;

    const { rows } = await pool.query(query, params);
    return rows;
};
