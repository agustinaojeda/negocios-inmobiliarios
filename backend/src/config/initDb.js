import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import { env } from './env.js';
import { pool } from './db.js';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//funcion para asegurar que la bd exista
const ensureDatabaseExists = async () => {
  //conexion temporal a la base de datos por defecto 'postgres'
  const client = new Client({
    host: env.PGHOST,
    port: env.PGPORT,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: 'postgres', 
  });

  try {
    await client.connect();
    //consulta si la base de datos ya existe
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [env.PGDATABASE]
    );

    if (res.rowCount === 0) {
      console.log(`La base de datos "${env.PGDATABASE}" no existe. Creándola...`);
      await client.query(`CREATE DATABASE "${env.PGDATABASE}"`);
      console.log(`Base de datos "${env.PGDATABASE}" creada exitosamente.`);
    }
  } catch (error) {
    console.error('Error al verificar/crear la base de datos:', error.message);
  } finally {
    await client.end();
  }
};

//funcion para la migracion
export const runMigrations = async () => {
  try {
    await ensureDatabaseExists();

    console.log('Ejecutando migraciones en la base de datos...');

    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('Tablas creadas/verificadas (schema.sql).');

    const seedPath = path.join(__dirname, '../../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedSql);
      console.log('Datos iniciales cargados (seed.sql).');
    }

    console.log('Migracion completada con exito :D');
  } catch (error) {
    console.error('Error al ejecutar las migraciones:', error.message);
  }
};