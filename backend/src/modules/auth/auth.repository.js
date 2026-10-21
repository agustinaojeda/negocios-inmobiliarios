import { pool } from '../../config/db.js';

export const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.contrasena, u.telefono, u.foto_perfil, u.esta_activo,
                   r.nombre AS rol
            FROM usuarios u
            LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
            LEFT JOIN roles r ON ur.rol_id = r.id_rol
            WHERE LOWER(u.email) = $1
            LIMIT 1
        `;

// Busca un usuario por email junto con su rol (lo usa el login)
export const buscarPorEmail = async (email) => {
    const query = `
        SELECT u.id, u.nombre, u.apellido, u.email, u.contrasena, u.telefono, u.foto_perfil, u.esta_activo,
               r.nombre AS rol
        FROM usuarios u
        LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
        LEFT JOIN roles r ON ur.rol_id = r.id_rol
        WHERE LOWER(u.email) = $1
        LIMIT 1
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
};

// Crea el usuario y le asigna el rol en UNA transacción (lo usa el registro)
// Devuelve null si el rol no existe
export const crearUsuarioConRol = async ({ nombre, apellido, email, contrasena, telefono, rol }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows: rolesRows } = await client.query(
            'SELECT id_rol FROM roles WHERE nombre = $1',
            [rol]
        );
        if (rolesRows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const { rows } = await client.query(
            `INSERT INTO usuarios (nombre, apellido, email, contrasena, telefono)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nombre, apellido, email, telefono, foto_perfil`,
            [nombre, apellido, email, contrasena, telefono]
        );
        const usuario = rows[0];

        await client.query(
            'INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [usuario.id, rolesRows[0].id_rol]
        );

        await client.query('COMMIT');
        return { ...usuario, rol };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err; // el controlador decide qué responder
    } finally {
        client.release();
    }
};