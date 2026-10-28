import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import * as authRepository from './auth.repository.js';

const SALT_ROUNDS = 10;

export const registro = async (req, res, next) => {
    try {
        const { nombre, apellido = '', email, password, telefono, rol = 'inquilino' } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const nuevoUsuario = await authRepository.crearUsuarioConRol({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: email.trim().toLowerCase(),
            contrasena: hash,
            telefono: telefono?.trim() || null,
            rol
        });

        if (!nuevoUsuario) {
            return res.status(400).json({ error: 'El rol indicado no existe' });
        }

        res.status(201).json({
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            email: nuevoUsuario.email,
            telefono: nuevoUsuario.telefono,
            fotoPerfil: nuevoUsuario.foto_perfil,
            rol: nuevoUsuario.rol
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un usuario registrado con ese email' });
        }
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son obligatorios' });
        }

        const usuario = await authRepository.buscarPorEmail(email.trim().toLowerCase());

        if (!usuario || !usuario.esta_activo) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordOk = await bcrypt.compare(password, usuario.contrasena);
        if (!passwordOk) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const rolUsuario = usuario.rol || 'inquilino';

        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, rol: rolUsuario },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                telefono: usuario.telefono,
                fotoPerfil: usuario.foto_perfil,
                rol: rolUsuario
            }
        });
    } catch (err) {
        next(err);
    }
};

export const perfil = (req, res) => {
    res.json(req.usuario);
};