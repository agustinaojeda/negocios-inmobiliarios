// recibe la peticion, llama al service y devuelve una rta http
import * as service from './dashboard.service.js';

// GET /api/dashboard
export const obtenerMetricas = async (req, res, next) => {
    try {
        const usuario = req.usuario; // Extraído del token JWT
        const resultado = await service.obtenerMetricas(usuario);

        if (resultado.forbidden) {
            return res.status(403).json({ error: resultado.mensaje });
        }

        return res.status(200).json(resultado);
    } catch (err) {
        next(err);
    }
};
