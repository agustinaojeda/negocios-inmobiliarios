import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

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

//mensaje para saber si funciono
app.listen(env.PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${env.PORT}`);
});