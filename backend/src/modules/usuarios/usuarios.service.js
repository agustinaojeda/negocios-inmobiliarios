//valida datos y llama al repo
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import * as repository from './usuarios.repository.js';

const SALT_ROUNDS = 10;
const PREFIJO_FOTOS = '/img/usuarios/';

// Borra una foto local de public/img/usuarios. Ignora URLs externas y archivos inexistentes
const borrarFotoLocal = async (rutaPublica) => {
    if (!rutaPublica || !rutaPublica.startsWith(PREFIJO_FOTOS)) return;
    const nombreArchivo = path.basename(rutaPublica); // evita path traversal
    try {
        await fs.unlink(path.join('public', 'img', 'usuarios', nombreArchivo));
    } catch (err) {
        if (err.code !== 'ENOENT') console.error('No se pudo borrar la foto:', err.message);
    }
};

const borrarArchivoSubido = async (archivo) => {
    if (archivo) await borrarFotoLocal(PREFIJO_FOTOS + archivo.filename);
};

export const obtenerPerfil = async (id) => {
    const usuario = await repository.buscarPorId(id);
    if (!usuario) return { noEncontrado: true };
    return { usuario };
};

export const actualizarPerfil = async (id, body = {}, archivo) => {
    try {
        const { nombre, apellido, telefono } = body;
        const campos = {};

        if (nombre !== undefined) {
            if (typeof nombre !== 'string' || !nombre.trim()) {
                await borrarArchivoSubido(archivo);
                return { datosInvalidos: 'El nombre no puede estar vacío' };
            }
            campos.nombre = nombre.trim();
        }

        if (apellido !== undefined) {
            if (typeof apellido !== 'string' || !apellido.trim()) {
                await borrarArchivoSubido(archivo);
                return { datosInvalidos: 'El apellido no puede estar vacío' };
            }
            campos.apellido = apellido.trim();
        }

        if (telefono !== undefined) {
            campos.telefono = typeof telefono === 'string' && telefono.trim() ? telefono.trim() : null;
        }

        if (archivo) {
            campos.fotoPerfil = PREFIJO_FOTOS + archivo.filename;
        }

        if (Object.keys(campos).length === 0) {
            return { sinCambios: true };
        }

        const actual = await repository.buscarPorId(id);
        if (!actual) {
            await borrarArchivoSubido(archivo);
            return { noEncontrado: true };
        }

        const usuario = await repository.actualizarPerfil(id, campos);
        if (!usuario) {
            await borrarArchivoSubido(archivo);
            return { noEncontrado: true };
        }

        // Si se reemplazó la foto, se borra la anterior (solo si era local)
        if (archivo && actual.foto_perfil !== usuario.foto_perfil) {
            await borrarFotoLocal(actual.foto_perfil);
        }

        return { usuario };
    } catch (err) {
        await borrarArchivoSubido(archivo);
        throw err;
    }
};

export const cambiarPassword = async (id, body = {}) => {
    const { passwordActual, passwordNueva } = body;

    if (!passwordActual || !passwordNueva) {
        return { datosInvalidos: 'passwordActual y passwordNueva son obligatorios' };
    }

    const hashActual = await repository.obtenerHashPassword(id);
    if (!hashActual) return { noEncontrado: true };

    const coincide = await bcrypt.compare(passwordActual, hashActual);
    if (!coincide) return { passwordIncorrecta: true };

    const nuevoHash = await bcrypt.hash(passwordNueva, SALT_ROUNDS);
    await repository.actualizarPassword(id, nuevoHash);

    return { ok: true };
};

export const listarUsuarios = async () => {
    const usuarios = await repository.listarTodos();
    return { usuarios };
};

export const cambiarEstado = async (adminId, idParam, estaActivo) => {
    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
        return { datosInvalidos: 'El id de usuario no es válido' };
    }

    if (typeof estaActivo !== 'boolean') {
        return { datosInvalidos: 'estaActivo debe ser true o false' };
    }

    if (id === Number(adminId)) {
        return { autoModificacion: true };
    }

    const usuario = await repository.actualizarEstado(id, estaActivo);
    if (!usuario) return { noEncontrado: true };

    return { usuario };
};
