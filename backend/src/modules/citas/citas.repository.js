// habla con la bd
import { pool } from '../../config/db.js';

// base del query con JOINs para traer la información completa que necesita el frontend
const QUERY_BASE_CITAS = `
  SELECT 
    c.id,
    c.inquilino_id,
    c.propiedad_id,
    c.fecha,
    c.hora,
    c.estado,
    c.mensaje,
    c.fecha_creacion,
    -- Datos del inmueble
    p.titulo AS propiedad_titulo,
    p.direccion AS propiedad_direccion,
    p.zona AS propiedad_zona,
    p.categoria AS propiedad_categoria,
    p.precio AS propiedad_precio,
    p.moneda AS propiedad_moneda,
    p.propietario_id,
    p.agente_id,
    (
      SELECT url FROM imagenes_propiedades 
      WHERE propiedad_id = p.id AND es_principal = true 
      LIMIT 1
    ) AS propiedad_img,
    -- Datos del inquilino (cliente que pide la cita)
    u_inq.nombre AS cliente_nombre,
    u_inq.apellido AS cliente_apellido,
    u_inq.email AS cliente_email,
    u_inq.telefono AS cliente_telefono,
    -- Datos del agente asignado al inmueble
    u_age.nombre AS agente_nombre,
    u_age.apellido AS agente_apellido,
    u_age.telefono AS agente_telefono
  FROM citas c
  INNER JOIN propiedades p ON c.propiedad_id = p.id
  INNER JOIN usuarios u_inq ON c.inquilino_id = u_inq.id
  LEFT JOIN usuarios u_age ON p.agente_id = u_age.id
`;

// crear una nueva solicitud de cita
export const crear = async ({ inquilinoId, propiedadId, fecha, hora, mensaje }) => {
    const query = `
    INSERT INTO citas (inquilino_id, propiedad_id, fecha, hora, mensaje, estado)
    VALUES ($1, $2, $3, $4, $5, 'pendiente')
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [
        inquilinoId,
        propiedadId,
        fecha,
        hora,
        mensaje || null,
    ]);
    return rows[0] || null;
};

// obtener una cita puntual por su ID
export const obtenerPorId = async (id) => {
    const query = `${QUERY_BASE_CITAS} WHERE c.id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
};

// obtener citas según el rol y el ID del usuario
export const obtenerPorUsuario = async ({ id, rol }) => {
    let query = QUERY_BASE_CITAS;
    const params = [];

    if (rol === 'inquilino') {
        params.push(id);
        query += ` WHERE c.inquilino_id = $1`;
    } else if (rol === 'agente') {
        params.push(id);
        // trae las citas donde es el agente del inmueble o citas sin agente asignado
        query += ` WHERE p.agente_id = $1 OR p.agente_id IS NULL`;
    } else if (rol === 'propietario') {
        params.push(id);
        query += ` WHERE p.propietario_id = $1`;
    }
    // si es 'admin', no agregamos WHERE y trae todas

    query += ` ORDER BY c.fecha DESC, c.hora DESC;`;

    const { rows } = await pool.query(query, params);
    return rows;
};

// cambiar el estado de la cita (confirmada, cancelada, completada, pendiente)
export const actualizarEstado = async (id, nuevoEstado) => {
    const query = `
    UPDATE citas
    SET estado = $1
    WHERE id = $2
    RETURNING *;
  `;
    const { rows } = await pool.query(query, [nuevoEstado, id]);
    return rows[0] || null;
};
