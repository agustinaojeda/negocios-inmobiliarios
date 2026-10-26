export const verificarRol = (rolRequerido) => { //admin - propietario - inquilino - agente
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autorizado: Debes iniciar sesión' });
        }

        if (req.usuario.rol !== rolRequerido.toLowerCase()) {
            return res.status(403).json({ 
                error: `Acceso denegado: Se requiere rol ${rolRequerido} para realizar esta acción` 
            });
        }

        next();
    };
};