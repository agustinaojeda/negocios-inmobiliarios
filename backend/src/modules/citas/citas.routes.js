// escucha la peticion y la deriva al controlador
import { Router } from 'express';
import * as controller from './citas.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';
import { verificarRol } from '../../shared/middlewares/verificarRol.js';

const router = Router();

// Obtener todas las citas que le corresponden al usuario según su rol
router.get('/', verificarToken, controller.obtenerCitas);

// Obtener una cita específica por ID
router.get('/:id', verificarToken, controller.obtenerCitaPorId);

// Crear una nueva cita (exclusivo para inquilinos con sesion)
router.post('/', verificarToken, verificarRol('inquilino'), controller.crearCita);

// Cambiar el estado de la cita (agentes, admin o el propio inquilino cancelando)
router.patch('/:id/estado', verificarToken, controller.cambiarEstado);

export default router;
