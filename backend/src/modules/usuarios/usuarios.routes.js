//escucha la peticion y la deriva al controlador
import { Router } from 'express';
import * as controller from './usuarios.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';
import { verificarRol } from '../../shared/middlewares/verificarRol.js';
import { crearUpload } from '../../shared/middlewares/upload.js';

const uploadUsuarios = crearUpload('usuarios');

// Envuelve multer para que los errores de archivo (tipo / tamaño) respondan 400 y no 500
const subirFoto = (req, res, next) => {
    uploadUsuarios.single('foto')(req, res, (err) => {
        if (err) {
            err.status = 400;
            if (err.code === 'LIMIT_FILE_SIZE') err.message = 'La imagen supera los 5 MB';
            return next(err);
        }
        next();
    });
};

const router = Router();

//usuario logueado
router.get('/perfil', verificarToken, controller.obtenerPerfil);
router.put('/perfil', verificarToken, subirFoto, controller.actualizarPerfil);
router.patch('/cambiar-password', verificarToken, controller.cambiarPassword);

//admin
router.get('/', verificarToken, verificarRol('admin','agente'), controller.listarUsuarios);
router.patch('/:id/estado', verificarToken, verificarRol('admin'), controller.cambiarEstado);

export default router;
