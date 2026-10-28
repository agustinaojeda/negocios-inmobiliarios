//recibe datos, los manda al service y devuelve una rta http
import * as service from './usuarios.service.js';

// Convierte la fila de la BD a camelCase y garantiza que no salga la contraseña
const formatearUsuario = (u) => ({
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    email: u.email,
    telefono: u.telefono,
    fotoPerfil: u.foto_perfil,
    estaActivo: u.esta_activo,
    rol: u.rol,
    fechaCreacion: u.fecha_creacion
});

export const obtenerPerfil = async (req, res, next) => {
    try {
        const resultado = await service.obtenerPerfil(req.usuario.id);

        if (resultado.noEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json(formatearUsuario(resultado.usuario));
    } catch (err) {
        next(err);
    }
};

export const actualizarPerfil = async (req, res, next) => {
    try {
        const resultado = await service.actualizarPerfil(req.usuario.id, req.body, req.file);

        if (resultado.datosInvalidos) {
            return res.status(400).json({ error: resultado.datosInvalidos });
        }

        if (resultado.sinCambios) {
            return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
        }

        if (resultado.noEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json(formatearUsuario(resultado.usuario));
    } catch (err) {
        next(err);
    }
};

export const cambiarPassword = async (req, res, next) => {
    try {
        const resultado = await service.cambiarPassword(req.usuario.id, req.body);

        if (resultado.datosInvalidos) {
            return res.status(400).json({ error: resultado.datosInvalidos });
        }

        if (resultado.noEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (resultado.passwordIncorrecta) {
            return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
        }

        return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (err) {
        next(err);
    }
};

export const listarUsuarios = async (req, res, next) => {
    try {
        const { usuarios } = await service.listarUsuarios();
        return res.status(200).json(usuarios.map(formatearUsuario));
    } catch (err) {
        next(err);
    }
};

export const cambiarEstado = async (req, res, next) => {
    try {
        const resultado = await service.cambiarEstado(
            req.usuario.id,
            req.params.id,
            req.body?.estaActivo
        );

        if (resultado.datosInvalidos) {
            return res.status(400).json({ error: resultado.datosInvalidos });
        }

        if (resultado.autoModificacion) {
            return res.status(400).json({ error: 'No podés cambiar el estado de tu propia cuenta' });
        }

        if (resultado.noEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json(formatearUsuario(resultado.usuario));
    } catch (err) {
        next(err);
    }
};
