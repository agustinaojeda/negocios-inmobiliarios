--sigue mas o menos los json

--roles
INSERT INTO roles (id_rol, nombre, descripcion) VALUES
(1, 'admin', 'Administrador del sistema con acceso total'),
(2, 'propietario', 'Dueño de inmuebles para alquiler o venta'),
(3, 'inquilino', 'Cliente interesado en alquilar o comprar'),
(4, 'agente', 'Agente inmobiliario encargado de gestionar visitas y ventas');

SELECT setval(pg_get_serial_sequence('roles', 'id_rol'), MAX(id_rol)) FROM roles;

--usuarios (contraseñas hasheadas con bcrypt, 10 rondas)
-- admin@inmobiliaria.com       -> admin123
-- propietario@inmobiliaria.com -> prop123
-- inquilino@inmobiliaria.com   -> inq123
-- agente@inmobiliaria.com      -> age123
INSERT INTO usuarios (id, nombre, apellido, email, contrasena, telefono, foto_perfil) VALUES
(1, 'Administrador', 'Principal', 'admin@inmobiliaria.com', '$2b$10$NSFOZmDjcYYYRPlVmQr99emVTrb9AI73wIlv6yT8R3sikAJUPLxiq', '1144556677', 'https://ui-avatars.com/api/?name=Admin+Principal&background=13284c&color=fff'),
(2, 'Carlos', 'Propietario', 'propietario@inmobiliaria.com', '$2b$10$lA4i2xK9Yr9m9X7DwrY1EexM4Cq6u6Av3/LQA/M.///nSyBAZU4vS', '1155667788', 'https://ui-avatars.com/api/?name=Carlos+Propietario&background=13284c&color=fff'),
(3, 'Mariana', 'Inquilina', 'inquilino@inmobiliaria.com', '$2b$10$pfModRZu8jhSWY8XkZgEhOtHKVbleXnf4D/pw8MH4Tn0Nd/XV4fJi', '1166778899', 'https://ui-avatars.com/api/?name=Mariana+Inquilina&background=13284c&color=fff'),
(4, 'Roberto', 'Agente', 'agente@inmobiliaria.com', '$2b$10$MY49egz.ehu7YwR8Fs9Xqu8FdlCI.3.YMMv7Wx1iWuXaBD/dWn.t2', '1177889900', 'https://ui-avatars.com/api/?name=Roberto+Agente&background=13284c&color=fff');

SELECT setval(pg_get_serial_sequence('usuarios', 'id'), MAX(id)) FROM usuarios;

--asignacion de roles a usuarios
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
(1, 1), -- Admin
(2, 2), -- Propietario
(3, 3), -- Inquilino
(4, 4); -- Agente

--propiedades
INSERT INTO propiedades 
(id, propietario_id, agente_id, titulo, descripcion, categoria, moneda, precio, expensas, direccion, zona, ambientes, banos, m2, estado_comercial, estado_visibilidad, fecha_creacion) 
VALUES
(1, 2, 4, 'Casa Moderna con Vista Panorámica', 'Casa moderna de autor con vistas panorámicas al río en Nordelta.', 'casa', 'USD', 280000.00, 0.00, 'Av. Del Libertador 8500', 'Palermo', 4, 3, 320, 'venta', 'activo', '2026-05-10 00:00:00'),
(2, 2, 4, 'Departamento con Terraza y Vista', 'Departamento luminoso con terraza privada y vistas al parque.', 'departamento', 'USD', 1800.00, 0.00, 'Armenia 1234', 'Palermo', 3, 2, 120, 'alquiler', 'activo', '2026-05-10 00:00:00'),
(3, 2, 4, 'Casa Familiar con Jardín y Pileta', 'Casa familiar con jardín paisajístico y pileta climatizada en country.', 'casa', 'USD', 195000.00, 0.00, 'Calle Las Palmas 456', 'Tigre', 5, 3, 480, 'venta', 'activo', '2026-10-10 00:00:00'),
(4, 2, 4, 'PH Premium con Vista a Buenos Aires', 'PH exclusivo con terraza privada y vista 360° al skyline porteño.', 'ph', 'USD', 520000.00, 0.00, 'Alicia Moreau de Justo 740', 'Puerto Madero', 5, 4, 290, 'venta', 'activo', '2026-09-10 00:00:00'),
(5, 2, 4, 'Casa Moderna con Piscina Infinita', 'Residencia premium con piscina infinita y jardín paisajístico.', 'casa', 'USD', 520000.00, 0.00, 'Av. Del Libertador 8900', 'Belgrano', 5, 4, 480, 'venta', 'activo', '2026-05-10 00:00:00'),
(6, 2, 4, 'Living Moderno Palermo Hollywood', 'Living moderno reformado en planta baja con patio exclusivo.', 'departamento', 'USD', 2200.00, 0.00, 'Humboldt 2356', 'Palermo', 2, 1, 65, 'alquiler', 'activo', '2026-10-10 00:00:00'),
(7, 2, 4, 'Cocina Premium Recoleta', 'Apartamento de lujo en edificio de categoría con amenities completos.', 'departamento', 'USD', 380000.00, 0.00, 'Av. Alvear 1801', 'Recoleta', 4, 3, 210, 'venta', 'activo', '2026-10-10 00:00:00'),
(8, 2, 4, 'Suite Maestro en Nordelta', 'Casa en barrio cerrado con acceso directo al lago y bote propio.', 'casa', 'USD', 145000.00, 0.00, 'Av. del Golf 1200', 'Nordelta', 3, 2, 180, 'venta', 'activo', '2026-10-10 00:00:00');

SELECT setval(pg_get_serial_sequence('propiedades', 'id'), MAX(id)) FROM propiedades;

--imagenes de propiedades
INSERT INTO imagenes_propiedades (propiedad_id, url, orden, es_principal) VALUES
(1, '/img/propiedades/prop1.jpg', 1, TRUE),
(2, '/img/propiedades/prop2.jpg', 1, TRUE),
(3, '/img/propiedades/prop3.jpg', 1, TRUE),
(4, '/img/propiedades/prop4.jpg', 1, TRUE),
(5, '/img/propiedades/prop5.jpg', 1, TRUE),
(6, '/img/propiedades/prop6.jpg', 1, TRUE),
(7, '/img/propiedades/prop7.jpg', 1, TRUE),
(8, '/img/propiedades/prop8.jpg', 1, TRUE);

--operaciones
INSERT INTO operaciones (propiedad_id, cliente_id, moneda, monto_cierre, fecha_operacion) VALUES
(3, 3, 'USD', 195000.00, '2026-10-10 00:00:00'), 
(6, 3, 'USD', 2200.00, '2026-10-10 00:00:00'),   
(7, 3, 'USD', 380000.00, '2026-10-10 00:00:00'); 

--citas
INSERT INTO citas (id, inquilino_id, propiedad_id, fecha, hora, estado, mensaje) VALUES
(1, 3, 1, '2026-10-14 00:00:00', '10:30:00', 'confirmada', 'Cita solicitada desde la web'),
(2, 3, 2, '2026-10-18 00:00:00', '16:00:00', 'pendiente', 'Cita solicitada desde la web'),
(3, 3, 5, '2026-09-02 00:00:00', '11:15:00', 'completada', 'Cita solicitada desde la web'),
(4, 3, 4, '2026-08-28 00:00:00', '14:30:00', 'cancelada', 'Cita solicitada desde la web');

SELECT setval(pg_get_serial_sequence('citas', 'id'), MAX(id)) FROM citas;