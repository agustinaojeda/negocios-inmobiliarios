//habla con la bd
import { pool } from "../../config/db.js";

export const obtenerPorUsuario = async (id) => {
  const query = `SELECT f.id AS favorito_id, f.fecha_agregado, p.*
    FROM favoritos f
    INNER JOIN propiedades p ON f.propiedad_id = p.id
    WHERE f.usuario_id = $1 AND p.fecha_baja IS NULL
    ORDER BY f.fecha_agregado DESC;`;

  const { rows: propiedades } = await pool.query(query, [id]);

  //buscamos las imagenes
  for (let i = 0; i < propiedades.length; i++) {
    propiedades[i].es_favorito = true;
    const queryImagenes = `SELECT id, url, orden, es_principal
      FROM imagenes_propiedades
      WHERE propiedad_id = $1
      ORDER BY orden ASC;`;

    const { rows: imagenes } = await pool.query(queryImagenes, [
      propiedades[i].id,
    ]);

    propiedades[i].imagenes = imagenes;
  }

  return propiedades;
};

export const existeFavorito = async (usuarioId, propiedadId) => {
  const query = `SELECT id FROM favoritos 
    WHERE usuario_id = $1 AND propiedad_id = $2;`;

  const { rows } = await pool.query(query, [usuarioId, propiedadId]);
  return rows.length > 0;
};

export const agregar = async (usuarioId, propiedadId) => {
  const query = `INSERT INTO favoritos (usuario_id, propiedad_id)
    VALUES ($1, $2)
    RETURNING *;`;
  const { rows } = await pool.query(query, [usuarioId, propiedadId]);
  return rows[0] || null;
};

export const eliminar = async (usuarioId, propiedadId) => {
  const query = `DELETE FROM favoritos
    WHERE usuario_id = $1 AND propiedad_id = $2
    RETURNING *;`;

  const { rows } = await pool.query(query, [usuarioId, propiedadId]);
  return rows[0] || null;
};