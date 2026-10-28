//habla con la bd
import { pool } from '../../config/db.js';

// Campos que se pueden exponer (nunca la contraseña ni los tokens de reset)
const CAMPOS_PUBLICOS = `
    u.id, u.nombre, u.apellido, u.email, u.telefono, u.foto_perfil,
    u.esta_activo, u.fecha_creacion, r.nombre AS rol
`;

// Un usuario tiene un único rol (usuario_roles.usuario_id es UNIQUE)
const JOIN_ROL = `
    LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
    LEFT JOIN roles r ON ur.rol_id = r.id_rol
`;

// Whitelist: clave recibida -> columna real. Evita inyección por nombre de columna
const COLUMNAS_EDITABLES = {
    nombre: 'nombre',
    apellido: 'apellido',
    telefono: 'telefono',
    fotoPerfil: 'foto_perfil'
};

export const buscarPorId = async (id) => {
    const query = `SELECT ${CAMPOS_PUBLICOS}
        FROM usuarios u
        ${JOIN_ROL}
        WHERE u.id = $1
        LIMIT 1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
};

// Solo se usa para validar la contraseña actual
export const obtenerHashPassword = async (id) => {
    const { rows } = await pool.query('SELECT contrasena FROM usuarios WHERE id = $1', [id]);
    return rows[0]?.contrasena || null;
};

// UPDATE dinámico solo con los campos presentes en "campos"
export const actualizarPerfil = async (id, campos) => {
    const sets = [];
    const valores = [];

    for (const [clave, valor] of Object.entries(campos)) {
        const columna = COLUMNAS_EDITABLES[clave];
        if (!columna) continue;
        valores.push(valor);
        sets.push(`${columna} = $${valores.length}`);
    }

    if (sets.length === 0) return buscarPorId(id);

    valores.push(id);
    const query = `UPDATE usuarios SET ${sets.join(', ')}
        WHERE id = $${valores.length}
        RETURNING id;`;

    const { rows } = await pool.query(query, valores);
    if (rows.length === 0) return null;
    return buscarPorId(id);
};

export const actualizarPassword = async (id, hash) => {
    const { rowCount } = await pool.query(
        'UPDATE usuarios SET contrasena = $1 WHERE id = $2',
        [hash, id]
    );
    return rowCount > 0;
};

export const listarTodos = async () => {
    const query = `SELECT ${CAMPOS_PUBLICOS}
        FROM usuarios u
        ${JOIN_ROL}
        ORDER BY u.fecha_creacion DESC;`;
    const { rows } = await pool.query(query);
    return rows;
};

export const actualizarEstado = async (id, estaActivo) => {
    const { rows } = await pool.query(
        'UPDATE usuarios SET esta_activo = $1 WHERE id = $2 RETURNING id',
        [estaActivo, id]
    );
    if (rows.length === 0) return null;
    return buscarPorId(id);
};
