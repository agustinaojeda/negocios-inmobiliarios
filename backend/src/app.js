import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import inmueblesRoutes from './modules/inmuebles/inmuebles.routes.js';
import favoritosRoutes from './modules/favoritos/favoritos.routes.js';
import citasRoutes from './modules/citas/citas.routes.js';
import usuariosRoutes from './modules/usuarios/usuarios.routes.js';
import operacionesRoutes from './modules/operaciones/operaciones.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import { notFound } from './shared/middlewares/notFound.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();

app.use(express.static('public'));

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/inmuebles', inmueblesRoutes);

app.use('/api/favoritos', favoritosRoutes);

app.use('/api/citas', citasRoutes);

app.use('/api/usuarios', usuariosRoutes);

app.use('/api/operaciones', operacionesRoutes);

app.use('/api/dashboard', dashboardRoutes);

// Manejo de errores y 404
app.use(notFound);
app.use(errorHandler);

export default app;