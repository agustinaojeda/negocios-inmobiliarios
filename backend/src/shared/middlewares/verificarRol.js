export const verificarRol = (...rolesPermitidos) => { //admin - propietario - inquilino - agente

    // Normalizamos una sola vez, al definir la ruta
    const roles = rolesPermitidos.map((r) => r.toLowerCase());

    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autorizado: Debes iniciar sesión' });
        }

        const rolUsuario = req.usuario.rol?.toLowerCase();

        if (!roles.includes(rolUsuario)) {
            return res.status(403).json({
                error: `Acceso denegado: Se requiere uno de estos roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};