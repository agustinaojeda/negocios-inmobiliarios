import { Router } from 'express';
import * as controller from './operaciones.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';

const router = Router();

// Obtener todas las operaciones filtradas por rol y opcionalmente por ?tipo=
router.get('/', verificarToken, controller.obtenerOperaciones);

// Obtener una operación puntual por ID
router.get('/:id', verificarToken, controller.obtenerOperacionPorId);

// Registrar una nueva operación comercial (cerrar venta o contrato de alquiler)
router.post('/', verificarToken, controller.crearOperacion);

export default router;
