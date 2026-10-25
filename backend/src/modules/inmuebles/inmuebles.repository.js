//el unico que puede hablar con la bd
import { pool } from "../../config/db.js";

//imagenes

export const obtenerImagenes = async (ids) => {
  const listaIds = Array.isArray(ids) ? ids : [ids];
  if (!listaIds || listaIds.length === 0) return [];

  const query = `
    SELECT id, propiedad_id, url, orden, es_principal
    FROM imagenes_propiedades
    WHERE propiedad_id = ANY($1)
    ORDER BY orden ASC;
  `;

  const { rows } = await pool.query(query, [listaIds]);
  return rows;
};

export const guardarImagenes = async (id, imagenes) => {
  const imagenesGuardadas = [];

  for (let i = 0; i < imagenes.length; i++) {
    const query = `INSERT INTO imagenes_propiedades (propiedad_id, url, orden, es_principal)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`;

    const url = typeof imagenes[i] === "string" ? imagenes[i] : imagenes[i].url;
    if (!url) continue;

    const orden = imagenes[i].orden || i + 1;
    const esPrincipal =
      imagenes[i].es_principal !== undefined
        ? imagenes[i].es_principal
        : i === 0; //la primer foto es la principal

    const values = [id, url, orden, esPrincipal];
    const { rows } = await pool.query(query, values);
    imagenesGuardadas.push(rows[0]);
  }

  return imagenesGuardadas;
};

export const eliminarImagenes = async (propiedadId) => {
  const query = `DELETE FROM imagenes_propiedades WHERE propiedad_id = $1;`;
  await pool.query(query, [propiedadId]);
};

export const obtenerImagenPorId = async (imagenId) => {
  const query = `SELECT id, propiedad_id, url, orden, es_principal
    FROM imagenes_propiedades
    WHERE id = $1;
  `;
  const { rows } = await pool.query(query, [imagenId]);
  return rows[0] || null;
};

export const eliminarImagen = async (imagenId) => {
  const query = `DELETE FROM imagenes_propiedades
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [imagenId]);
  return rows[0];
};

//historial precios
export const registrarHistorialPrecio = async (
  propiedadId,
  precioAnterior,
  precioNuevo,
) => {
  const query = `INSERT INTO historial_precios (propiedad_id, precio_anterior, precio_nuevo, fecha_cambio)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [
    propiedadId,
    precioAnterior,
    precioNuevo,
  ]);
  return rows[0];
};

export const obtenerHistorialPrecios = async (propiedadId) => {
  const query = `SELECT id, propiedad_id, precio_anterior, precio_nuevo, fecha_cambio
    FROM historial_precios
    WHERE propiedad_id = $1
    ORDER BY fecha_cambio ASC;
  `;
  const { rows } = await pool.query(query, [propiedadId]);
  return rows;
};

//propiedades

export const listar = async (
  filtros = {},
  incluirInactivas = false,
  agenteId = null,
) => {
  const { categoria, zona, estado_comercial, estado_visibilidad } = filtros;

  let query = `SELECT id, propietario_id, agente_id, titulo, descripcion, categoria, moneda, precio, expensas, zona, direccion, ambientes, banos, m2, estado_comercial, estado_visibilidad, fecha_creacion, fecha_actualizacion
    FROM propiedades
    WHERE 1=1
  `;

  const values = [];

  //si no es agente solo ve las activas
  if (!incluirInactivas) {
    values.push("activo");
    query += ` AND estado_visibilidad = $${values.length}`;
  }

  //si es un agente filtra las que son de el
  if (agenteId) {
    values.push(agenteId);
    query += ` AND agente_id = $${values.length}`;
  }

  //filtros
  if (categoria) {
    values.push(categoria);
    query += ` AND categoria = $${values.length}`;
  }
  if (zona) {
    values.push(zona);
    query += ` AND zona = $${values.length}`;
  }
  if (estado_comercial) {
    values.push(estado_comercial);
    query += ` AND estado_comercial = $${values.length}`;
  }
  if (estado_visibilidad) {
    values.push(estado_visibilidad);
    query += ` AND estado_visibilidad = $${values.length}`;
  }

  query += ` ORDER BY fecha_actualizacion DESC;`;

  const { rows } = await pool.query(query, values);
  return rows;
};

export const obtener = async (id, incluirInactivas = false) => {
  //detalle de una propiedad + detalle del agente y propietario
  let query = `SELECT propiedades.id, propiedades.titulo, propiedades.descripcion, propiedades.categoria, propiedades.moneda, propiedades.precio, propiedades.expensas, propiedades.zona, propiedades.direccion, propiedades.ambientes, propiedades.banos, propiedades.m2, propiedades.estado_comercial,propiedades.estado_visibilidad,propiedades.fecha_actualizacion,
    propiedades.propietario_id, p_usr.nombre AS propietario_nombre, p_usr.apellido AS propietario_apellido, p_usr.email AS propietario_email, p_usr.telefono AS propietario_telefono,
    propiedades.agente_id, a_usr.nombre AS agente_nombre, a_usr.apellido AS agente_apellido, a_usr.email AS agente_email, a_usr.telefono AS agente_telefono
    FROM propiedades
    LEFT JOIN usuarios AS p_usr ON propiedades.propietario_id = p_usr.id
    LEFT JOIN usuarios AS a_usr ON propiedades.agente_id = a_usr.id
    WHERE propiedades.id = $1`;

  const values = [id];

  if (!incluirInactivas) {
    query += ` AND estado_visibilidad = 'activo' AND fecha_baja IS NULL`;
  }

  const { rows } = await pool.query(query, values);

  return rows[0] || null;
};

export const crear = async (datos) => {
  const {
    propietario_id,
    agente_id,
    titulo,
    descripcion,
    categoria,
    moneda,
    precio,
    expensas,
    direccion,
    zona,
    ambientes,
    banos,
    m2,
    estado_comercial,
    estado_visibilidad,
  } = datos;

  const query = `INSERT INTO propiedades (propietario_id, agente_id, titulo, descripcion, categoria, moneda, precio, expensas, direccion, zona, ambientes, banos, m2, estado_comercial, estado_visibilidad)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;`;

  const values = [
    propietario_id || null,
    agente_id,
    titulo,
    descripcion,
    categoria,
    moneda,
    precio,
    expensas || 0,
    direccion,
    zona,
    ambientes,
    banos,
    m2,
    estado_comercial,
    estado_visibilidad || "activo",
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const actualizar = async (id, datos) => {
  const {
    propietario_id,
    agente_id,
    titulo,
    descripcion,
    categoria,
    moneda,
    precio,
    expensas,
    direccion,
    zona,
    ambientes,
    banos,
    m2,
    estado_comercial,
    estado_visibilidad,
  } = datos;

  const query = `UPDATE propiedades
        SET propietario_id = $1, agente_id = $2, titulo = $3, descripcion = $4, categoria = $5, moneda = $6, precio = $7, expensas = $8, direccion = $9, zona = $10, ambientes = $11, banos = $12, m2 = $13, estado_comercial = $14, estado_visibilidad = $15, fecha_baja = CASE WHEN $15::VARCHAR = 'inactivo' THEN CURRENT_TIMESTAMP ELSE NULL END, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $16
        RETURNING *;
    `;

  const values = [
    propietario_id || null,
    agente_id,
    titulo,
    descripcion,
    categoria,
    moneda,
    precio,
    expensas || 0,
    direccion,
    zona,
    ambientes,
    banos,
    m2,
    estado_comercial,
    estado_visibilidad || "activo",
    id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const darDeBaja = async (id) => {
  const query = `UPDATE propiedades
        SET estado_visibilidad = 'inactivo', fecha_baja = CURRENT_TIMESTAMP, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const activar = async (id) => {
  const query = `UPDATE propiedades
    SET estado_visibilidad = 'activo', fecha_baja = NULL, fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

//verificar si es prop
export const esPropietario = async (propietarioId) => {
  const query = `SELECT u.id 
    FROM usuarios u
    JOIN usuario_roles ur ON u.id = ur.usuario_id
    JOIN roles r ON ur.rol_id = r.id_rol
    WHERE u.id = $1 AND u.esta_activo = TRUE AND (r.id_rol = 2 OR r.nombre = 'propietario');`;

  const { rows } = await pool.query(query, [propietarioId]);
  return rows.length > 0;
};
