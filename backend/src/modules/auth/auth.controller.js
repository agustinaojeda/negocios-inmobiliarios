export const registro = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        // (si falta algún campo → 400)
        // 1. Nunca se guarda la contraseña real: se guarda su hash
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        // 2. RETURNING sin password: la respuesta nunca incluye el hash
        const { rows } = await pool.query(
            `INSERT INTO usuarios(nombre, email, password)
            VALUES($1, $2, $3)
            RETURNING id, nombre, email,`
            [nombre, email, hash]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        // 23505 = código de PostgreSQL para "valor duplicado"
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
        }
        next(err);
    }
};