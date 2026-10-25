import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import inmueblesRoutes from './modules/inmuebles/inmuebles.routes.js';
import favoritosRoutes from './modules/favoritos/favoritos.routes.js';
import { notFound } from './shared/middlewares/notFound.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();

app.use(express.static('public'));

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/inmuebles', inmueblesRoutes);

app.use('/api/favoritos', favoritosRoutes);

// Manejo de errores y 404
app.use(notFound);
app.use(errorHandler);

export default app;