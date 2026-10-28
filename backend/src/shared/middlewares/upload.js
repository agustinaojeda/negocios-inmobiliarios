import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Crea una instancia de multer configurada para guardar en una subcarpeta específica dentro de public/img/
 * @param {string} subcarpeta - Nombre de la subcarpeta (ej: 'propiedades', 'usuarios', etc.)
 */
export const crearUpload = (subcarpeta = 'propiedades') => {
  const destino = path.join('public', 'img', subcarpeta);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Si la carpeta no existe, la crea automáticamente
      if (!fs.existsSync(destino)) {
        fs.mkdirSync(destino, { recursive: true });
      }
      cb(null, destino);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, nombreUnico);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('El archivo subido no es una imagen válida'), false);
    }
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5 MB
    fileFilter
  });
};

// Instancia por defecto para propiedades (mantiene compatibilidad con inmuebles.routes.js sin tener que modificarlo)
export const upload = crearUpload('propiedades');