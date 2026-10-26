// recibe datos, los manda al service y devuelve una rta http
import * as service from './citas.service.js';

// POST /api/citas
export const crearCita = async (req, res, next) => {
    try {
        const usuario = req.usuario; // Obtenido del token JWT
        const { propiedadId, fecha, hora, mensaje } = req.body;

        const resultado = await service.crearCita(usuario, {
            propiedadId,
            fecha,
            hora,
            mensaje,
        });

        if (resultado.forbidden) {
            return res.status(403).json({ error: resultado.mensaje });
        }

        if (resultado.datosInvalidos) {
            return res.status(400).json({ error: resultado.mensaje });
        }

        if (resultado.noEncontrada) {
            return res.status(404).json({ error: resultado.mensaje });
        }

        return res.status(201).json({
            mensaje: 'Cita solicitada exitosamente',
            cita: resultado.nuevaCita,
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/citas
export const obtenerCitas = async (req, res, next) => {
    try {
        const usuario = req.usuario;
        const resultado = await service.obtenerCitas(usuario);
        return res.status(200).json(resultado);
    } catch (err) {
        next(err);
    }
};

// GET /api/citas/:id
export const obtenerCitaPorId = async (req, res, next) => {
    try {
        const usuario = req.usuario;
        const { id } = req.params;

        const resultado = await service.obtenerCitaPorId(usuario, id);

        if (resultado.noEncontrada) {
            return res.status(404).json({ error: 'La cita especificada no existe' });
        }

        if (resultado.forbidden) {
            return res.status(403).json({ error: resultado.mensaje });
        }

        return res.status(200).json(resultado.cita);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/citas/:id/estado
export const cambiarEstado = async (req, res, next) => {
    try {
        const usuario = req.usuario;
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: 'El campo estado es obligatorio' });
        }

        const resultado = await service.cambiarEstado(usuario, id, estado);

        if (resultado.datosInvalidos) {
            return res.status(400).json({ error: resultado.mensaje });
        }

        if (resultado.noEncontrada) {
            return res.status(404).json({ error: 'La cita especificada no existe' });
        }

        if (resultado.forbidden) {
            return res.status(403).json({ error: resultado.mensaje });
        }

        return res.status(200).json({
            mensaje: 'Estado de la cita actualizado con éxito',
            cita: resultado.citaActualizada,
        });
    } catch (err) {
        next(err);
    }
};
