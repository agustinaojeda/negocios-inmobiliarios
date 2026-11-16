import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

const isLocal = env.DATABASE_URL
  ? env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('127.0.0.1')
  : env.PGHOST === 'localhost' || env.PGHOST === '127.0.0.1';

// Pool de conexiones (soporta DATABASE_URL de la Guía 2 o variables PG* separadas)
export const pool = new Pool({
  ...(env.DATABASE_URL
    ? { connectionString: env.DATABASE_URL }
    : {
        host: env.PGHOST,
        port: env.PGPORT,
        user: env.PGUSER,
        password: env.PGPASSWORD,
        database: env.PGDATABASE,
      }),
  ssl: !isLocal ? { rejectUnauthorized: false } : false,

  max: 20, // cantidad máxima de clientes (conexiones) simultáneas en el pool
  min: 0, // cantidad mínima de clientes que se mantienen abiertos en el pool

  idleTimeoutMillis: 30000, // ms que una conexión inactiva puede quedar abierta antes de cerrarse
  connectionTimeoutMillis: 15000, // ms de espera para establecer una conexión antes de fallar
  query_timeout: 10000, // ms máximo de espera por la respuesta de una query (lado cliente)
  statement_timeout: 10000, // ms máximo que el servidor Postgres deja correr una sentencia SQL

  allowExitOnIdle: false, // si está en true, permite que el proceso de Node termine cuando el pool queda vacío e inactivo
});

// Log de errores de conexiones inactivas que el servidor puede cerrar inesperadamente
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones', err);
});

//mensaje para saber si funciono BORRARLO DESPUES
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err.message);
  } else {
    console.log('Base de datos PostgreSQL conectada con éxito');
  }
});