# AGENTS.md

Plataforma inmobiliaria full-stack en JavaScript (React + Express + PostgreSQL). `backend/` y `frontend/` son proyectos npm independientes: no hay `package.json` raíz, workspace, tests ni CI. Ejecutá los comandos dentro de cada carpeta.

## Comandos

Backend (desde `backend/`):
- `npm run dev` — servidor con recarga (`node --watch src/server.js`) en `http://localhost:3000`.
- `npm start` — servidor sin recarga.
- `npm run db:migrate` — **borra y recrea todas las tablas** (ver Base de datos).

Frontend (desde `frontend/`):
- `npm run dev` — Vite en `http://localhost:5173`.
- `npm run build` — build de producción (hoy compila correctamente).
- `npm run lint` — falla con ~76 problemas preexistentes (55 `no-unused-vars`, 8 `react-hooks/set-state-in-effect`, 10 `preserve-caught-error`, 1 `no-useless-escape`). No es una base limpia: no intentes resolver toda la deuda para validar un cambio.
- `npm run preview` — sirve el build.

No existe script de test en ninguno de los dos paquetes. Para backend, verificá levantando el server y llamando endpoints por HTTP; para frontend, `npm run build`.

En PowerShell de este entorno `npm` puede estar bloqueado por execution policy: usar `cmd /c "npm run ..."`.

## Backend

- ESM puro (`"type": "module"`), sin build ni transpilación. Usa `process.loadEnvFile()`, así que requiere Node 20.12+ (acá hay Node 24).
- **Ejecutá siempre desde `backend/`**: `.env` se carga relativo al CWD y `express.static('public')`/multer usan rutas relativas. `node backend/src/server.js` desde la raíz falla por falta de `JWT_SECRET`.
- `.env` es obligatorio y debe tener `JWT_SECRET` (sin valor por defecto: el proceso lanza al arrancar). Plantilla en `.env.example`.
- Estructura: `src/modules/<dominio>/<dominio>.routes|controller|service|repository.js`. Solo el repository ejecuta SQL; el controller traduce a HTTP; `app.js` monta cada módulo en `/api/<dominio>`.
- Auth: JWT en `Authorization: Bearer <token>`; `verificarToken` llena `req.usuario` y `verificarRol('admin', ...)` restringe. Roles en minúsculas: `admin`, `propietario`, `inquilino`, `agente` (tabla `roles`).
- Errores: responder `{ error: 'mensaje' }`; los controllers llaman `next(err)` y el `errorHandler` global oculta el detalle de los 500. Para errores esperados, seteá `err.status`.
- Sin ORM ni librería de validación: SQL a mano con `pg` y validaciones en los services. En el backend respetá snake_case de PostgreSQL; auth/usuarios formatean a camelCase (`fotoPerfil`, `estaActivo`) antes de responder.
- Subidas: multer guarda en `public/img/propiedades` (máx. 5 MB, solo imágenes) y se sirve como `/img/...`; en la BD se guardan rutas relativas. `public/` está versionado: evitá commitear imágenes de prueba.

## Base de datos

- `database/schema.sql` es la fuente de verdad; no hay migraciones incrementales ni historial.
- `npm run db:migrate` ejecuta `schema.sql` (empieza con `DROP TABLE ... CASCADE`) y luego `seed.sql`: **destruye los datos existentes** y recarga los demo.
- El script atrapa los errores y puede terminar con código 0 aunque la migración falle; verificá tablas/usuarios después de correrlo.
- Usuarios demo: `admin@inmobiliaria.com` / `admin123`, `propietario@inmobiliaria.com` / `prop123`, `inquilino@inmobiliaria.com` / `inq123`, `agente@inmobiliaria.com` / `age123`.

## Frontend

- React 19 + Vite 8 + React Compiler (plugin Babel) + Bootstrap 5. Rutas con React Router v8 importado de `react-router`: **no** existe `react-router-dom` en dependencias.
- Organización: `src/features/<dominio>/` (`auth`, `home`, `inmuebles`, `inquilino`, `propietario`, `agente`, `admin`) con `pages/`, `components/`, `hooks/`, `services/`, `styles/`; lo transversal vive en `src/shared/`. Cada feature reexporta en su `index.js`.
- `src/router.jsx` centraliza las rutas: públicas bajo `LayoutPublico`, privadas bajo `LayoutPrivado` con loaders por rol. Los paneles privados cambian de vista con `seccionActiva` vía `useOutletContext`; al agregar una sección, actualizá `shared/config/sidebarMenuConfig.jsx` y el `*Page.jsx` del rol.
- Toda llamada HTTP nueva debe pasar por `shared/services/apiClient.js`: antepone `${VITE_API_URL || 'http://localhost:3000'}/api`, agrega el JWT y ante un 401 borra la sesión y redirige a `/login`. No uses `fetch` directo. Quedan restos del prototipo JSON/localStorage (`data/usuarios`, constantes `URL_BASE` sin uso): no los extiendas.
- Sesión en localStorage bajo `negocios-inmobiliarios:token` y `negocios-inmobiliarios:sesion`. Los permisos reales están en el backend; los loaders del router son solo UX.
- `useFetch(servicio, parametro)` dispara el efecto según la identidad de `servicio`: pasá siempre una función importada/estable, nunca una arrow inline (provoca loop de requests).
- Imágenes: `shared/utils/imagenUrl.js` (`obtenerUrlImagen`) hardcodea `http://localhost:3000` y lo usan varias tarjetas/galerías; `shared/config/api.js` (`resolverUrlImagen`) respeta `VITE_API_URL`. Si cambiás host/puerto de la API, revisá ambos.
- CORS del backend solo acepta `CORS_ORIGIN` (default `http://localhost:5173`). Si Vite toma otro puerto, actualizá `backend/.env`.

## Convenciones

- Nombres de archivos, funciones, tablas, mensajes de UI y commits van mayormente en español.
- No hay CI, formatter ni guía de PR. No reformatees archivos ajenos ni "limpies" imports no usados en masa: el lint ya tiene deuda preexistente.
