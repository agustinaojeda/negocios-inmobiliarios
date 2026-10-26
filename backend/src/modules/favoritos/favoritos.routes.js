//escucha la peticion y la deriva al controlador
import { Router } from 'express';
import * as controller from './favoritos.controller.js';
import { verificarToken } from '../../shared/middlewares/verificarToken.js';
import { verificarRol } from '../../shared/middlewares/verificarRol.js';

const router = Router();

//inquilino
router.get('/', verificarToken, verificarRol('inquilino'), controller.obtenerFavoritos);
router.post('/:id', verificarToken, verificarRol('inquilino'), controller.agregarFavorito);
router.delete('/:id', verificarToken, verificarRol('inquilino'), controller.eliminarFavorito);

export default router;