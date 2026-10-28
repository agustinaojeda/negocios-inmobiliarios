import * as service from './operaciones.service.js';

// POST /api/operaciones
export const crearOperacion = async (req, res, next) => {
    try {
        const usuario = req.usuario; // Extraído del token JWT por verificarToken
        const {
            propiedadId,
            clienteId,
            moneda,
            montoCierre,
            fechaInicioContrato,
            fechaFinContrato,
        } = req.body;

        const resultado = await service.crearOperacion(usuario, {
            propiedadId,
            clienteId,
            moneda,
            montoCierre,
            fechaInicioContrato,
            fechaFinContrato,
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

        if (resultado.conflicto) {
            return res.status(409).json({ error: resultado.mensaje });
        }

        return res.status(201).json({
            mensaje: 'Operación comercial registrada con éxito',
            operacion: resultado.nuevaOperacion,
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/operaciones (soporta filtro opcional ?tipo=alquiler o ?tipo=venta)
export const obtenerOperaciones = async (req, res, next) => {
    try {
        const usuario = req.usuario;
        const { tipo } = req.query;

        const resultado = await service.obtenerOperaciones(usuario, { tipo });
        return res.status(200).json(resultado);
    } catch (err) {
        next(err);
    }
};

// GET /api/operaciones/:id
export const obtenerOperacionPorId = async (req, res, next) => {
    try {
        const usuario = req.usuario;
        const { id } = req.params;

        const resultado = await service.obtenerOperacionPorId(usuario, id);

        if (resultado.noEncontrada) {
            return res.status(404).json({ error: 'La operación comercial especificada no existe' });
        }

        if (resultado.forbidden) {
            return res.status(403).json({ error: resultado.mensaje });
        }

        return res.status(200).json(resultado.operacion);
    } catch (err) {
        next(err);
    }
};
