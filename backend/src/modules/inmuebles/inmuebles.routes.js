//escucha la peticion y la deriva al controlador
import { Router } from 'express';
import * as controller from './inmuebles.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';
import { verificarRol } from '../../shared/middlewares/verificarRol.js';

const router = Router();

router.get('/', controller.listar); //publica (prop activas)

router.get('/panel', verificarToken, verificarRol('agente'), controller.listarPanel); //agente (prop act e inac)
router.get('/panel/:id', verificarToken, verificarRol('agente'), controller.obtenerPanel); //detalle agente (si esta inac la muestra)

router.get('/:id', controller.obtener); //detalle publica (si esta inac da 404)

//agente
router.post('/', verificarToken, verificarRol('agente'), controller.crear);
router.put('/:id', verificarToken, verificarRol('agente'), controller.actualizar);
router.delete('/:id', verificarToken, verificarRol('agente'), controller.eliminar);
router.patch('/:id/activar', verificarToken, verificarRol('agente'), controller.activar);

//agente y propietario
router.get('/:id/historial-precios', verificarToken, verificarRol('agente', 'propietario'), controller.obtenerHistorial);

export default router;