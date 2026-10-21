import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { pool } from './config/db.js';

import authRoutes from './modules/auth/auth.routes.js';
import { notFound } from './shared/middlewares/notFound.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Endpoint de prueba: Obtener todas las propiedades
app.get('/propiedades', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM propiedades WHERE estado_visibilidad = $1', ['activo']);
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar propiedades:', error);
    res.status(500).json({ error: 'Error al obtener las propiedades' });
  }
});

// Manejo de errores y 404
app.use(notFound);
app.use(errorHandler);

export default app;