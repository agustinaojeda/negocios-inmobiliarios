// escucha la peticion y la deriva al controlador
import { Router } from 'express';
import * as controller from './dashboard.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';

const router = Router();

// GET /api/dashboard (protegido con token JWT)
router.get('/', verificarToken, controller.obtenerMetricas);

export default router;
