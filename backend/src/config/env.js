// Carga las variables del archivo .env en process.env (si existe; en producción las inyecta el hosting)
try {
  process.loadEnvFile();
} catch {
  // En producción (Render, Railway, etc.) no existe archivo .env físico
}

export const env = {
  PORT: process.env.PORT ?? 3000,
  CORS_ORIGIN: process.env.FRONTEND_URL ?? process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL,
  PGHOST: process.env.PGHOST ?? 'localhost',
  PGPORT: process.env.PGPORT ?? 5432,
  PGUSER: process.env.PGUSER ?? 'postgres',
  PGPASSWORD: process.env.PGPASSWORD ?? 'postgres',
  PGDATABASE: process.env.PGDATABASE ?? 'negocios-inmobiliarios',

  // JWT: clave para firmar los tokens y cuánto duran
  JWT_SECRET: process.env.JWT_SECRET, // sin valor por defecto: el secreto NUNCA va en el código
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
};

// Si falta el secreto, el servidor no arranca (mejor fallar ahora que firmar tokens inseguros)
if (!env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}
