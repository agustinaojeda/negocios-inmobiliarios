//escucha la peticion y la deriva al controlador
import { Router } from 'express';
import * as controller from './inmuebles.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';
import { verificarRol } from '../../shared/middlewares/verificarRol.js';
import { upload } from '../../shared/middlewares/upload.js';

const router = Router();

router.get('/', controller.listar); //publica (prop activas)

router.get('/panel', verificarToken, verificarRol('agente','admin','propietario'), controller.listarPanel); //agente= prop act e inac asignadas a el, admin= todas, propietario= las de el
router.get('/panel/:id', verificarToken, verificarRol('agente','admin'), controller.obtenerPanel); //detalle agente (si esta inac la muestra)

router.get('/:id', controller.obtener); //detalle publica (si esta inac da 404)

//agente
router.post('/', verificarToken, verificarRol('agente'), upload.array('imagenes', 10), controller.crear);
router.put('/:id', verificarToken, verificarRol('agente'), upload.array('imagenes', 10), controller.actualizar);
router.delete('/:id', verificarToken, verificarRol('agente'), controller.eliminar);
router.patch('/:id/activar', verificarToken, verificarRol('agente'), controller.activar);

//imagenes - agente
router.delete('/imagenes/:id', verificarToken, verificarRol('agente'), controller.eliminarImagen);

//agente y propietario
router.get('/:id/historial-precios', verificarToken, verificarRol('agente', 'propietario'), controller.obtenerHistorial);

export default router;