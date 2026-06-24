-- ============================================================
-- INSERTS DE PRUEBA PARA DOCKER
-- Todas las fechas y horas de partidos están expresadas en horario de Uruguay (UYT, UTC-3).
-- Contraseña de prueba para todos los usuarios: la misma usada en el backend de demo.
-- ============================================================

-- ============================================================
-- 1. USUARIOS DE PRUEBA
-- ============================================================

INSERT INTO usuario (
    email, nombre, habilitado, pais_documento, tipo_documento, numero_documento,
    localidad_direccion, calle_direccion, pais_direccion, numero_direccion, codigo_postal_direccion
) VALUES
    ('facundo.piriz@correo.ucu.edu.uy', 'Facundo Píriz', TRUE, 'Uruguay', 'CI', 55574121, 'Montevideo', 'Av. 8 de Octubre', 'Uruguay', 1234, 11600),
    ('agustin.garciab@correo.ucu.edu.uy', 'Agustín García', TRUE, 'Uruguay', 'CI', 55992757, 'Montevideo', 'Comandante Braga', 'Uruguay', 2715, 11400),
    ('agostina.etchebarren@correo.ucu.edu.uy', 'Agostina Etchebarren', TRUE, 'Uruguay', 'CI', 10000020, 'Montevideo', 'Cornelio Cantera', 'Uruguay', 2733, 11600),
    ('felipe.paladino@correo.ucu.edu.uy', 'Felipe Paladino', TRUE, 'Uruguay', 'CI', 10000070, 'Montevideo', 'Estero Bellaco', 'Uruguay', 2771, 11600),
    ('lucio.fernandez@correo.ucu.edu.uy', 'Lucio Fernández', TRUE, 'Uruguay', 'CI', 10010089, 'Salto', 'Artigas', 'Uruguay', 1251, 50000),
    ('maria.lopez@correo.ucu.edu.uy', 'María López', TRUE, 'Uruguay', 'CI', 10020082, 'Maldonado', 'Roosevelt', 'Uruguay', 711, 20000),
    ('valentina.martinez@correo.ucu.edu.uy', 'Valentina Martínez', TRUE, 'Uruguay', 'CI', 10040094, 'Montevideo', 'Av. Brasil', 'Uruguay', 2468, 11300),
    ('rodrigo.gonzalez@correo.ucu.edu.uy', 'Rodrigo González', TRUE, 'Uruguay', 'CI', 10030091, 'Montevideo', 'Bulevar Artigas', 'Uruguay', 2345, 11300),
    ('camila.santos@correo.ucu.edu.uy', 'Camila Santos', TRUE, 'Uruguay', 'CI', 10050100, 'Montevideo', 'Av. Italia', 'Uruguay', 3456, 11400),
    ('sofia.araujo@correo.ucu.edu.uy', 'Sofía Araujo', TRUE, 'Uruguay', 'CI', 10060012, 'Canelones', 'Treinta y Tres', 'Uruguay', 620, 90000),
    ('fabrizio.rodriguez@correo.ucu.edu.uy', 'Fabrizio Rodríguez', TRUE, 'Uruguay', 'CI', 33333333, 'Montevideo', 'Av. Italia', 'Uruguay', 3456, 11400),
    ('constanza.blanco@correo.ucu.edu.uy', 'Constanza Blanco', TRUE, 'Uruguay', 'CI', 10000036, 'Montevideo', 'San Ignacio', 'Uruguay', 2733, 11600),
    ('manuel.cabrera@correo.ucu.edu.uy', 'Manuel Cabrera', TRUE, 'Uruguay', 'CI', 10000042, 'Montevideo', 'Athanasius', 'Uruguay', 2871, 11600),
    ('nicolas.pereira@correo.ucu.edu.uy', 'Nicolás Pereira', TRUE, 'Uruguay', 'CI', 10060010, 'Montevideo', 'Garibaldi', 'Uruguay', 2831, 11600),
    ('julieta.suarez@correo.ucu.edu.uy', 'Julieta Suárez', TRUE, 'Uruguay', 'CI', 10060011, 'Punta del Este', 'Florencia', 'Uruguay', 712, 20100),
    ('diego.deoliveira@correo.ucu.edu.uy', 'Diego De Oliveira', TRUE, 'Uruguay', 'CI', 56901393, 'Montevideo', 'Bulevar Artigas', 'Uruguay', 2345, 11300),
    ('thiago.garcia@correo.ucu.edu.uy', 'Thiago García', TRUE, 'Uruguay', 'CI', 10000008, 'San Ramón', 'Mevir', 'Uruguay', 4567, 11500),
    ('santiago.aguerre@correo.ucu.edu.uy', 'Santiago Aguerre', TRUE, 'Uruguay', 'CI', 10000014, 'Montevideo', 'Av. Brasil', 'Uruguay', 5678, 11300),
    ('martin.mujica@correo.ucu.edu.uy', 'Martín Mujica', TRUE, 'Uruguay', 'CI', 10000058, 'Montevideo', 'Rivera', 'Uruguay', 3001, 11300),
    ('santiago.blanco@correo.ucu.edu.uy', 'Santiago Blanco', TRUE, 'Uruguay', 'CI', 10000064, 'Montevideo', 'Luis A. de Herrera', 'Uruguay', 1290, 11600);

INSERT INTO login (email, contrasena) VALUES
    ('facundo.piriz@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('agustin.garciab@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('agostina.etchebarren@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('felipe.paladino@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('lucio.fernandez@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('maria.lopez@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('valentina.martinez@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('rodrigo.gonzalez@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('camila.santos@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('sofia.araujo@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('fabrizio.rodriguez@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('constanza.blanco@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('manuel.cabrera@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('nicolas.pereira@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('julieta.suarez@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('diego.deoliveira@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('thiago.garcia@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('santiago.aguerre@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('martin.mujica@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq'),
    ('santiago.blanco@correo.ucu.edu.uy', '$2a$12$NX..FDs1Wc.b2psJKyt41e02DvoRH3.gIwU3KkiDgwLWRp/L0SsKq');

INSERT INTO general (email_general, fecha_registro, estado_verificacion) VALUES
    ('facundo.piriz@correo.ucu.edu.uy', '2026-05-01 10:00:00', TRUE),
    ('agustin.garciab@correo.ucu.edu.uy', '2026-05-02 10:07:00', TRUE),
    ('agostina.etchebarren@correo.ucu.edu.uy', '2026-05-03 10:14:00', TRUE),
    ('felipe.paladino@correo.ucu.edu.uy', '2026-05-04 10:21:00', TRUE),
    ('lucio.fernandez@correo.ucu.edu.uy', '2026-05-05 10:28:00', TRUE),
    ('maria.lopez@correo.ucu.edu.uy', '2026-05-06 10:35:00', TRUE),
    ('valentina.martinez@correo.ucu.edu.uy', '2026-05-07 10:42:00', TRUE),
    ('rodrigo.gonzalez@correo.ucu.edu.uy', '2026-05-08 10:49:00', FALSE),
    ('camila.santos@correo.ucu.edu.uy', '2026-05-09 10:56:00', TRUE),
    ('sofia.araujo@correo.ucu.edu.uy', '2026-05-10 10:03:00', TRUE);

INSERT INTO admin (email_admin, fecha_asignacion, pais) VALUES
    ('diego.deoliveira@correo.ucu.edu.uy', '2026-05-10 09:00:00', 'EEUU'),
    ('thiago.garcia@correo.ucu.edu.uy', '2026-05-11 09:00:00', 'México'),
    ('santiago.aguerre@correo.ucu.edu.uy', '2026-05-12 09:00:00', 'Canadá'),
    ('martin.mujica@correo.ucu.edu.uy', '2026-05-13 09:00:00', 'EEUU'),
    ('santiago.blanco@correo.ucu.edu.uy', '2026-05-14 09:00:00', 'México');

INSERT INTO funcionario (email_funcionario, numero_legajo) VALUES
    ('fabrizio.rodriguez@correo.ucu.edu.uy', 1001),
    ('constanza.blanco@correo.ucu.edu.uy', 1002),
    ('manuel.cabrera@correo.ucu.edu.uy', 1003),
    ('nicolas.pereira@correo.ucu.edu.uy', 1004),
    ('julieta.suarez@correo.ucu.edu.uy', 1005);

INSERT INTO telefonos (email_usuario, telefono) VALUES
    ('facundo.piriz@correo.ucu.edu.uy', '+59891000000'),
    ('facundo.piriz@correo.ucu.edu.uy', '+59822000000'),
    ('agustin.garciab@correo.ucu.edu.uy', '+59891000001'),
    ('agostina.etchebarren@correo.ucu.edu.uy', '+59891000002'),
    ('felipe.paladino@correo.ucu.edu.uy', '+59891000003'),
    ('felipe.paladino@correo.ucu.edu.uy', '+59822000003'),
    ('lucio.fernandez@correo.ucu.edu.uy', '+59891000004'),
    ('maria.lopez@correo.ucu.edu.uy', '+59891000005'),
    ('valentina.martinez@correo.ucu.edu.uy', '+59891000006'),
    ('valentina.martinez@correo.ucu.edu.uy', '+59822000006'),
    ('rodrigo.gonzalez@correo.ucu.edu.uy', '+59891000007'),
    ('camila.santos@correo.ucu.edu.uy', '+59891000008'),
    ('sofia.araujo@correo.ucu.edu.uy', '+59891000009'),
    ('sofia.araujo@correo.ucu.edu.uy', '+59822000009'),
    ('fabrizio.rodriguez@correo.ucu.edu.uy', '+59891000010'),
    ('constanza.blanco@correo.ucu.edu.uy', '+59891000011'),
    ('manuel.cabrera@correo.ucu.edu.uy', '+59891000012'),
    ('nicolas.pereira@correo.ucu.edu.uy', '+59891000013'),
    ('julieta.suarez@correo.ucu.edu.uy', '+59891000014'),
    ('diego.deoliveira@correo.ucu.edu.uy', '+59891000015'),
    ('thiago.garcia@correo.ucu.edu.uy', '+59891000016'),
    ('santiago.aguerre@correo.ucu.edu.uy', '+59891000017'),
    ('martin.mujica@correo.ucu.edu.uy', '+59891000018'),
    ('santiago.blanco@correo.ucu.edu.uy', '+59891000019');

INSERT INTO dispositivo_escaneo (
    id_dispositivo_escaneo,
    modelo,
    installation_id,
    activo,
    email_funcionario
) OVERRIDING SYSTEM VALUE VALUES
    (1, 'Honeywell CT45', 'demo-honeywell-ct45-0001', TRUE, 'fabrizio.rodriguez@correo.ucu.edu.uy'),
    (2, 'Zebra TC26', 'demo-zebra-tc26-0002', TRUE, 'constanza.blanco@correo.ucu.edu.uy'),
    (3, 'Samsung XCover Pro', 'demo-samsung-xcover-0003', TRUE, 'manuel.cabrera@correo.ucu.edu.uy'),
    (4, 'Motorola Edge 40 Neo', 'demo-motorola-edge-0004', TRUE, 'nicolas.pereira@correo.ucu.edu.uy'),
    (5, 'iPhone SE 2022', 'demo-iphone-se-0005', TRUE, 'julieta.suarez@correo.ucu.edu.uy'),
    (6, 'Tablet demo inactiva', 'demo-tablet-inactiva-0006', FALSE, 'fabrizio.rodriguez@correo.ucu.edu.uy');

-- ============================================================
-- 2. EQUIPOS DEL MUNDIAL 2026
-- ============================================================

INSERT INTO equipo (codigo_fifa, nombre_equipo, grupo) VALUES
-- Grupo A
('MEX', 'México', 'A'),
('RSA', 'Sudáfrica', 'A'),
('KOR', 'Corea del Sur', 'A'),
('CZE', 'Chequia', 'A'),

-- Grupo B
('CAN', 'Canadá', 'B'),
('BIH', 'Bosnia y Herzegovina', 'B'),
('QAT', 'Qatar', 'B'),
('SUI', 'Suiza', 'B'),

-- Grupo C
('BRA', 'Brasil', 'C'),
('MAR','Marruecos', 'C'),
('HAI', 'Haití', 'C'),
('SCO','Escocia', 'C'),

-- Grupo D
('USA', 'Estados Unidos', 'D'),
('PAR','Paraguay', 'D'),
('AUS','Australia', 'D'),
('TUR','Turquía', 'D'),

-- Grupo E
('GER','Alemania', 'E'),
('CUW','Curazao', 'E'),
('CIV','Costa de Marfil', 'E'),
('ECU','Ecuador', 'E'),

-- Grupo F
('NED','Países Bajos', 'F'),
('JPN','Japón', 'F'),
('SWE','Suecia', 'F'),
('TUN', 'Túnez', 'F'),

-- Grupo G
('BEL','Bélgica', 'G'),
('EGY','Egipto', 'G'),
('IRN','Irán', 'G'),
('NZL','Nueva Zelanda', 'G'),

-- Grupo H
('ESP','España', 'H'),
('CPV','Cabo Verde', 'H'),
('KSA','Arabia Saudita', 'H'),
('URU','Uruguay', 'H'),

-- Grupo I
('FRA','Francia', 'I'),
('SEN','Senegal', 'I'),
('IRQ','Irak', 'I'),
('NOR','Noruega', 'I'),

-- Grupo J
('ARG','Argentina', 'J'),
('ALG','Argelia', 'J'),
('AUT','Austria', 'J'),
('JOR','Jordania', 'J'),

-- Grupo K
('POR','Portugal', 'K'),
('COD','RD Congo', 'K'),
('UZB','Uzbekistán', 'K'),
('COL','Colombia', 'K'),

-- Grupo L
('ENG','Inglaterra', 'L'),
('CRO','Croacia', 'L'),
('GHA','Ghana', 'L'),
('PAN','Panamá', 'L');

-- ============================================================
-- 3. ESTADIOS
-- ============================================================

INSERT INTO estadio (
    id_estadio,
    nombre_estadio,
    capacidad,
    ubicacion,
    ciudad,
    pais
) OVERRIDING SYSTEM VALUE VALUES
    (1, 'MetLife Stadium', 82500, 'East Rutherford', 'New Jersey', 'EEUU'),
    (2, 'SoFi Stadium', 70240, 'Inglewood', 'Los Angeles', 'EEUU'),
    (3, 'AT&T Stadium', 80000, 'Arlington', 'Dallas', 'EEUU'),
    (4, 'Mercedes-Benz Stadium', 71000, 'Atlanta', 'Atlanta', 'EEUU'),
    (5, 'NRG Stadium', 72220, 'Houston', 'Houston', 'EEUU'),
    (6, 'Arrowhead Stadium', 76416, 'Kansas City', 'Kansas City', 'EEUU'),
    (7, 'Lincoln Financial Field', 67594, 'Philadelphia', 'Philadelphia', 'EEUU'),
    (8, 'Lumen Field', 68740, 'Seattle', 'Seattle', 'EEUU'),
    (9, 'Levis Stadium', 68500, 'Santa Clara', 'San Francisco', 'EEUU'),
    (10, 'Hard Rock Stadium', 65326, 'Miami Gardens', 'Miami', 'EEUU'),
    (11, 'Gillette Stadium', 65878, 'Foxborough', 'Boston', 'EEUU'),
    (12, 'BC Place', 54500, 'Vancouver', 'Vancouver', 'Canadá'),
    (13, 'BMO Field', 45000, 'Toronto', 'Toronto', 'Canadá'),
    (14, 'Estadio Azteca', 87523, 'Coyoacán', 'Ciudad de México', 'México'),
    (15, 'Estadio Akron', 49850, 'Zapopan', 'Guadalajara', 'México'),
    (16, 'Estadio BBVA', 53500, 'Guadalupe', 'Monterrey', 'México');


-- ============================================================
-- 4. SECTORES A, B, C Y D PARA CADA ESTADIO
-- ============================================================

INSERT INTO sector (nombre_sector, capacidad, id_estadio, costo) VALUES
    ('A', 20625, 1, 300),
    ('B', 20625, 1, 220),
    ('C', 20625, 1, 160),
    ('D', 20625, 1, 100),
    ('A', 17560, 2, 300),
    ('B', 17560, 2, 220),
    ('C', 17560, 2, 160),
    ('D', 17560, 2, 100),
    ('A', 20000, 3, 300),
    ('B', 20000, 3, 220),
    ('C', 20000, 3, 160),
    ('D', 20000, 3, 100),
    ('A', 17750, 4, 300),
    ('B', 17750, 4, 220),
    ('C', 17750, 4, 160),
    ('D', 17750, 4, 100),
    ('A', 18055, 5, 300),
    ('B', 18055, 5, 220),
    ('C', 18055, 5, 160),
    ('D', 18055, 5, 100),
    ('A', 19104, 6, 300),
    ('B', 19104, 6, 220),
    ('C', 19104, 6, 160),
    ('D', 19104, 6, 100),
    ('A', 16898, 7, 300),
    ('B', 16898, 7, 220),
    ('C', 16898, 7, 160),
    ('D', 16900, 7, 100),
    ('A', 17185, 8, 300),
    ('B', 17185, 8, 220),
    ('C', 17185, 8, 160),
    ('D', 17185, 8, 100),
    ('A', 17125, 9, 300),
    ('B', 17125, 9, 220),
    ('C', 17125, 9, 160),
    ('D', 17125, 9, 100),
    ('A', 16331, 10, 300),
    ('B', 16331, 10, 220),
    ('C', 16331, 10, 160),
    ('D', 16333, 10, 100),
    ('A', 16469, 11, 300),
    ('B', 16469, 11, 220),
    ('C', 16469, 11, 160),
    ('D', 16471, 11, 100),
    ('A', 13625, 12, 300),
    ('B', 13625, 12, 220),
    ('C', 13625, 12, 160),
    ('D', 13625, 12, 100),
    ('A', 11250, 13, 300),
    ('B', 11250, 13, 220),
    ('C', 11250, 13, 160),
    ('D', 11250, 13, 100),
    ('A', 21880, 14, 300),
    ('B', 21880, 14, 220),
    ('C', 21880, 14, 160),
    ('D', 21883, 14, 100),
    ('A', 12462, 15, 300),
    ('B', 12462, 15, 220),
    ('C', 12462, 15, 160),
    ('D', 12464, 15, 100),
    ('A', 13375, 16, 300),
    ('B', 13375, 16, 220),
    ('C', 13375, 16, 160),
    ('D', 13375, 16, 100);


-- ============================================================
-- PARTIDOS DEL MUNDIAL 2026
-- ============================================================

INSERT INTO partido (
    id_partido, fecha, hora, id_estadio, equipo_visitante, equipo_local,
    marcador_local, marcador_visitante, costo, fase, estado, email_admin, fecha_habilitacion
) OVERRIDING SYSTEM VALUE VALUES
    (1, '2026-06-11', '16:00', 14, 'RSA', 'MEX', 2, 1, 60, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (2, '2026-06-11', '23:00', 15, 'CZE', 'KOR', 1, 1, 45, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (3, '2026-06-12', '16:00', 13, 'BIH', 'CAN', 2, 0, 55, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (4, '2026-06-12', '22:00', 2, 'PAR', 'USA', 1, 1, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (5, '2026-06-13', '16:00', 9, 'SUI', 'QAT', 0, 2, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (6, '2026-06-13', '19:00', 1, 'MAR', 'BRA', 2, 2, 65, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (7, '2026-06-13', '22:00', 11, 'SCO', 'HAI', 0, 1, 45, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (8, '2026-06-14', '01:00', 12, 'TUR', 'AUS', 1, 2, 50, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (9, '2026-06-14', '14:00', 5, 'CUW', 'GER', 3, 0, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (10, '2026-06-14', '17:00', 3, 'JPN', 'NED', 2, 1, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (11, '2026-06-14', '20:00', 7, 'ECU', 'CIV', 1, 1, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (12, '2026-06-14', '23:00', 16, 'TUN', 'SWE', 1, 0, 45, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (13, '2026-06-15', '13:00', 4, 'CPV', 'ESP', 3, 1, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (14, '2026-06-15', '16:00', 8, 'EGY', 'BEL', 2, 0, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (15, '2026-06-15', '19:00', 10, 'URU', 'KSA', 1, 2, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (16, '2026-06-15', '22:00', 2, 'NZL', 'IRN', 1, 0, 45, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (17, '2026-06-16', '16:00', 1, 'SEN', 'FRA', 2, 1, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (18, '2026-06-16', '19:00', 11, 'NOR', 'IRQ', 0, 2, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (19, '2026-06-16', '22:00', 6, 'ALG', 'ARG', 2, 0, 65, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (20, '2026-06-17', '01:00', 9, 'JOR', 'AUT', 1, 0, 45, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (21, '2026-06-17', '14:00', 5, 'COD', 'POR', 3, 1, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (22, '2026-06-17', '17:00', 3, 'CRO', 'ENG', 2, 2, 65, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (23, '2026-06-17', '20:00', 13, 'PAN', 'GHA', 1, 1, 45, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (24, '2026-06-17', '23:00', 14, 'COL', 'UZB', 0, 1, 50, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (25, '2026-06-18', '13:00', 4, 'RSA', 'CZE', 1, 0, 45, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (26, '2026-06-18', '16:00', 2, 'BIH', 'SUI', 2, 1, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (27, '2026-06-18', '19:00', 12, 'QAT', 'CAN', 2, 0, 55, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (28, '2026-06-18', '22:00', 15, 'KOR', 'MEX', 1, 1, 60, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (29, '2026-06-19', '16:00', 8, 'AUS', 'USA', 2, 1, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (30, '2026-06-19', '19:00', 11, 'MAR', 'SCO', 0, 2, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (31, '2026-06-19', '21:30', 7, 'HAI', 'BRA', 4, 0, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (32, '2026-06-20', '00:00', 9, 'PAR', 'TUR', 1, 1, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (33, '2026-06-20', '14:00', 5, 'SWE', 'NED', 1, 1, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (34, '2026-06-20', '17:00', 13, 'CIV', 'GER', 2, 1, 55, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (35, '2026-06-20', '21:00', 6, 'CUW', 'ECU', 2, 0, 45, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (36, '2026-06-21', '01:00', 16, 'JPN', 'TUN', 0, 1, 45, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (37, '2026-06-21', '13:00', 4, 'KSA', 'ESP', 2, 0, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (38, '2026-06-21', '16:00', 2, 'IRN', 'BEL', 2, 1, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (39, '2026-06-21', '19:00', 10, 'CPV', 'URU', 2, 0, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (40, '2026-06-21', '22:00', 12, 'EGY', 'NZL', 0, 1, 45, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (41, '2026-06-22', '14:00', 3, 'AUT', 'ARG', 2, 1, 65, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (42, '2026-06-22', '18:00', 7, 'IRQ', 'FRA', 3, 0, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (43, '2026-06-22', '21:00', 13, 'SEN', 'NOR', 1, 1, 50, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (44, '2026-06-23', '00:00', 9, 'ALG', 'JOR', 0, 2, 45, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (45, '2026-06-23', '14:00', 5, 'UZB', 'POR', 2, 0, 55, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (46, '2026-06-23', '17:00', 11, 'GHA', 'ENG', 2, 1, 65, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (47, '2026-06-23', '20:00', 11, 'CRO', 'PAN', 0, 2, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (48, '2026-06-23', '23:00', 15, 'COD', 'COL', 2, 1, 50, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (49, '2026-06-24', '16:00', 12, 'CAN', 'SUI', 1, 2, 60, 'Fase de grupos', 'terminado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (50, '2026-06-24', '16:00', 8, 'QAT', 'BIH', 2, 0, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (51, '2026-06-24', '19:00', 4, 'HAI', 'MAR', 3, 1, 50, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (52, '2026-06-24', '19:00', 10, 'BRA', 'SCO', 0, 2, 60, 'Fase de grupos', 'terminado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (53, '2026-06-24', '22:00', 16, 'KOR', 'RSA', 1, 1, 45, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (54, '2026-06-24', '22:00', 14, 'MEX', 'CZE', 0, 2, 60, 'Fase de grupos', 'terminado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (55, '2026-06-25', '17:00', 7, 'CIV', 'CUW', 0, 0, 45, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (56, '2026-06-25', '17:00', 1, 'GER', 'ECU', 0, 0, 55, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (57, '2026-06-25', '20:00', 6, 'NED', 'TUN', 0, 0, 55, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (58, '2026-06-25', '20:00', 3, 'SWE', 'JPN', 0, 0, 55, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (59, '2026-06-25', '23:00', 2, 'USA', 'TUR', 0, 0, 60, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (60, '2026-06-25', '23:00', 9, 'AUS', 'PAR', 0, 0, 50, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (61, '2026-06-26', '16:00', 11, 'FRA', 'NOR', 0, 0, 60, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (62, '2026-06-26', '16:00', 13, 'IRQ', 'SEN', 0, 0, 50, 'Fase de grupos', 'no empezado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (63, '2026-06-26', '21:00', 5, 'KSA', 'CPV', 0, 0, 50, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (64, '2026-06-26', '21:00', 15, 'ESP', 'URU', 0, 0, 60, 'Fase de grupos', 'no empezado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-01'),
    (65, '2026-06-27', '00:00', 12, 'BEL', 'NZL', 0, 0, 55, 'Fase de grupos', 'no empezado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-01'),
    (66, '2026-06-27', '00:00', 8, 'IRN', 'EGY', 0, 0, 50, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (67, '2026-06-27', '18:00', 1, 'ENG', 'PAN', 0, 0, 65, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (68, '2026-06-27', '18:00', 7, 'GHA', 'CRO', 0, 0, 55, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (69, '2026-06-27', '20:30', 10, 'POR', 'COL', 0, 0, 60, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (70, '2026-06-27', '20:30', 4, 'UZB', 'COD', 0, 0, 50, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (71, '2026-06-27', '23:00', 6, 'AUT', 'ALG', 0, 0, 50, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (72, '2026-06-27', '23:00', 3, 'ARG', 'JOR', 0, 0, 65, 'Fase de grupos', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-01'),
    (73, '2026-07-02', '20:00', 1, 'CAN', 'URU', 0, 0, 90, 'Dieciseisavos de final', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-20'),
    (74, '2026-07-03', '18:00', 14, 'JPN', 'MEX', 0, 0, 85, 'Dieciseisavos de final', 'no empezado', 'thiago.garcia@correo.ucu.edu.uy', '2026-06-20'),
    (75, '2026-07-04', '21:00', 12, 'SEN', 'CAN', 0, 0, 80, 'Dieciseisavos de final', 'no empezado', 'santiago.aguerre@correo.ucu.edu.uy', '2026-06-20'),
    (76, '2026-07-06', '20:00', 10, 'MEX', 'URU', 0, 0, 110, 'Octavos de final', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-24'),
    (77, '2026-07-10', '19:00', 3, 'ESP', 'BRA', 0, 0, 130, 'Cuartos de final', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-06-28'),
    (78, '2026-07-14', '20:00', 2, 'ARG', 'URU', 0, 0, 150, 'Semifinal', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-07-01'),
    (79, '2026-07-15', '20:00', 16, 'FRA', 'POR', 0, 0, 150, 'Semifinal', 'no empezado', 'thiago.garcia@correo.ucu.edu.uy', '2026-07-01'),
    (80, '2026-07-19', '19:00', 1, 'BRA', 'URU', 0, 0, 200, 'Final', 'no empezado', 'diego.deoliveira@correo.ucu.edu.uy', '2026-07-05');


-- ============================================================
-- 6. PARTIDO_SECTOR
-- ============================================================

INSERT INTO partido_sector (id_partido, nombre_sector, id_estadio) VALUES
    (1, 'A', 14),
    (1, 'B', 14),
    (1, 'C', 14),
    (1, 'D', 14),
    (2, 'A', 15),
    (2, 'B', 15),
    (2, 'C', 15),
    (2, 'D', 15),
    (3, 'A', 13),
    (3, 'B', 13),
    (3, 'C', 13),
    (3, 'D', 13),
    (4, 'A', 2),
    (4, 'B', 2),
    (4, 'C', 2),
    (5, 'A', 9),
    (5, 'B', 9),
    (5, 'C', 9),
    (5, 'D', 9),
    (6, 'A', 1),
    (6, 'B', 1),
    (7, 'B', 11),
    (7, 'C', 11),
    (7, 'D', 11),
    (8, 'A', 12),
    (8, 'B', 12),
    (8, 'C', 12),
    (8, 'D', 12),
    (9, 'A', 5),
    (9, 'D', 5),
    (10, 'C', 3),
    (10, 'D', 3),
    (11, 'A', 7),
    (11, 'B', 7),
    (11, 'C', 7),
    (11, 'D', 7),
    (12, 'A', 16),
    (12, 'B', 16),
    (12, 'C', 16),
    (12, 'D', 16),
    (13, 'A', 4),
    (13, 'B', 4),
    (13, 'C', 4),
    (13, 'D', 4),
    (14, 'A', 8),
    (14, 'B', 8),
    (14, 'C', 8),
    (14, 'D', 8),
    (15, 'A', 10),
    (15, 'B', 10),
    (15, 'C', 10),
    (15, 'D', 10),
    (16, 'A', 2),
    (16, 'B', 2),
    (16, 'C', 2),
    (16, 'D', 2),
    (17, 'A', 1),
    (17, 'B', 1),
    (17, 'C', 1),
    (17, 'D', 1),
    (18, 'A', 11),
    (18, 'B', 11),
    (18, 'C', 11),
    (18, 'D', 11),
    (19, 'A', 6),
    (19, 'B', 6),
    (19, 'C', 6),
    (19, 'D', 6),
    (20, 'A', 9),
    (20, 'B', 9),
    (20, 'C', 9),
    (20, 'D', 9),
    (21, 'A', 5),
    (21, 'B', 5),
    (21, 'C', 5),
    (21, 'D', 5),
    (22, 'A', 3),
    (22, 'B', 3),
    (22, 'C', 3),
    (22, 'D', 3),
    (23, 'A', 13),
    (23, 'B', 13),
    (23, 'C', 13),
    (23, 'D', 13),
    (24, 'A', 14),
    (24, 'B', 14),
    (24, 'C', 14),
    (24, 'D', 14),
    (25, 'A', 4),
    (25, 'B', 4),
    (25, 'C', 4),
    (25, 'D', 4),
    (26, 'A', 2),
    (26, 'B', 2),
    (26, 'C', 2),
    (26, 'D', 2),
    (27, 'A', 12),
    (27, 'B', 12),
    (27, 'C', 12),
    (27, 'D', 12),
    (28, 'A', 15),
    (28, 'B', 15),
    (28, 'C', 15),
    (28, 'D', 15),
    (29, 'A', 8),
    (29, 'B', 8),
    (29, 'C', 8),
    (29, 'D', 8),
    (30, 'A', 11),
    (30, 'B', 11),
    (30, 'C', 11),
    (30, 'D', 11),
    (31, 'A', 7),
    (31, 'B', 7),
    (31, 'C', 7),
    (31, 'D', 7),
    (32, 'A', 9),
    (32, 'B', 9),
    (32, 'C', 9),
    (32, 'D', 9),
    (33, 'A', 5),
    (33, 'B', 5),
    (33, 'C', 5),
    (33, 'D', 5),
    (34, 'A', 13),
    (34, 'B', 13),
    (34, 'C', 13),
    (34, 'D', 13),
    (35, 'A', 6),
    (35, 'B', 6),
    (35, 'C', 6),
    (35, 'D', 6),
    (36, 'A', 16),
    (36, 'B', 16),
    (36, 'C', 16),
    (36, 'D', 16),
    (37, 'A', 4),
    (37, 'B', 4),
    (37, 'C', 4),
    (37, 'D', 4),
    (38, 'A', 2),
    (38, 'B', 2),
    (38, 'C', 2),
    (38, 'D', 2),
    (39, 'A', 10),
    (39, 'B', 10),
    (39, 'C', 10),
    (39, 'D', 10),
    (40, 'A', 12),
    (40, 'B', 12),
    (40, 'C', 12),
    (40, 'D', 12),
    (41, 'A', 3),
    (41, 'B', 3),
    (41, 'C', 3),
    (41, 'D', 3),
    (42, 'A', 7),
    (42, 'B', 7),
    (42, 'C', 7),
    (42, 'D', 7),
    (43, 'A', 13),
    (43, 'B', 13),
    (43, 'C', 13),
    (43, 'D', 13),
    (44, 'A', 9),
    (44, 'B', 9),
    (44, 'C', 9),
    (44, 'D', 9),
    (45, 'A', 5),
    (45, 'B', 5),
    (45, 'C', 5),
    (45, 'D', 5),
    (46, 'A', 11),
    (46, 'B', 11),
    (46, 'C', 11),
    (46, 'D', 11),
    (47, 'A', 11),
    (47, 'B', 11),
    (47, 'C', 11),
    (47, 'D', 11),
    (48, 'A', 15),
    (48, 'B', 15),
    (48, 'C', 15),
    (48, 'D', 15),
    (49, 'A', 12),
    (49, 'B', 12),
    (49, 'C', 12),
    (49, 'D', 12),
    (50, 'A', 8),
    (50, 'B', 8),
    (50, 'C', 8),
    (50, 'D', 8),
    (51, 'A', 4),
    (51, 'B', 4),
    (51, 'C', 4),
    (51, 'D', 4),
    (52, 'A', 10),
    (52, 'B', 10),
    (52, 'C', 10),
    (52, 'D', 10),
    (53, 'A', 16),
    (53, 'B', 16),
    (53, 'C', 16),
    (53, 'D', 16),
    (54, 'A', 14),
    (54, 'B', 14),
    (54, 'C', 14),
    (54, 'D', 14),
    (55, 'A', 7),
    (55, 'B', 7),
    (55, 'C', 7),
    (55, 'D', 7),
    (56, 'A', 1),
    (56, 'B', 1),
    (56, 'C', 1),
    (56, 'D', 1),
    (57, 'A', 6),
    (57, 'B', 6),
    (57, 'C', 6),
    (57, 'D', 6),
    (58, 'A', 3),
    (58, 'B', 3),
    (58, 'C', 3),
    (58, 'D', 3),
    (59, 'A', 2),
    (59, 'B', 2),
    (59, 'C', 2),
    (59, 'D', 2),
    (60, 'A', 9),
    (60, 'B', 9),
    (60, 'C', 9),
    (60, 'D', 9),
    (61, 'A', 11),
    (61, 'B', 11),
    (61, 'C', 11),
    (61, 'D', 11),
    (62, 'A', 13),
    (62, 'B', 13),
    (62, 'C', 13),
    (62, 'D', 13),
    (63, 'A', 5),
    (63, 'B', 5),
    (63, 'C', 5),
    (63, 'D', 5),
    (64, 'A', 15),
    (64, 'B', 15),
    (64, 'C', 15),
    (64, 'D', 15),
    (65, 'A', 12),
    (65, 'B', 12),
    (65, 'C', 12),
    (65, 'D', 12),
    (66, 'A', 8),
    (66, 'B', 8),
    (66, 'C', 8),
    (66, 'D', 8),
    (67, 'A', 1),
    (67, 'B', 1),
    (67, 'C', 1),
    (67, 'D', 1),
    (68, 'A', 7),
    (68, 'B', 7),
    (68, 'C', 7),
    (68, 'D', 7),
    (69, 'A', 10),
    (69, 'B', 10),
    (69, 'C', 10),
    (69, 'D', 10),
    (70, 'A', 4),
    (70, 'B', 4),
    (70, 'C', 4),
    (70, 'D', 4),
    (71, 'A', 6),
    (71, 'B', 6),
    (71, 'C', 6),
    (71, 'D', 6),
    (72, 'A', 3),
    (72, 'B', 3),
    (72, 'C', 3),
    (72, 'D', 3),
    (73, 'A', 1),
    (73, 'B', 1),
    (73, 'C', 1),
    (73, 'D', 1),
    (74, 'A', 14),
    (74, 'B', 14),
    (74, 'C', 14),
    (74, 'D', 14),
    (75, 'A', 12),
    (75, 'B', 12),
    (75, 'C', 12),
    (75, 'D', 12),
    (76, 'A', 10),
    (76, 'B', 10),
    (76, 'C', 10),
    (76, 'D', 10),
    (77, 'A', 3),
    (77, 'B', 3),
    (77, 'C', 3),
    (77, 'D', 3),
    (78, 'A', 2),
    (78, 'B', 2),
    (78, 'C', 2),
    (78, 'D', 2),
    (79, 'A', 16),
    (79, 'B', 16),
    (79, 'C', 16),
    (79, 'D', 16),
    (80, 'A', 1),
    (80, 'B', 1),
    (80, 'C', 1),
    (80, 'D', 1);

-- ============================================================
-- 7. DATOS DE DEMO: COMPRAS, ENTRADAS, TRANSFERENCIAS Y VALIDACIONES
-- ============================================================

-- ------------------------------------------------------------
-- 7.1 Compras
-- ------------------------------------------------------------

INSERT INTO compra (
    id_compra,
    fecha_hora,
    monto_total,
    porcentaje_comision,
    email_usuario,
    estado
) OVERRIDING SYSTEM VALUE VALUES

    (1, '2026-06-14 11:30:00', 662, 5, 'facundo.piriz@correo.ucu.edu.uy', 'paga'),
    (2, '2026-06-20 12:10:00', 226, 5, 'maria.lopez@correo.ucu.edu.uy', 'paga'),
    (3, '2026-06-26 18:20:00', 284, 5, 'facundo.piriz@correo.ucu.edu.uy', 'paga'),
    (4, '2026-06-26 18:35:00', 404, 5, 'agustin.garciab@correo.ucu.edu.uy', 'paga'),
    (5, '2026-06-26 19:00:00', 189, 5, 'sofia.araujo@correo.ucu.edu.uy', 'paga'),
    (6, '2026-06-26 19:20:00', 651, 5, 'valentina.martinez@correo.ucu.edu.uy', 'paga'),
    (7, '2026-06-25 14:00:00', 1607, 5, 'felipe.paladino@correo.ucu.edu.uy', 'paga'),
    (8, '2026-06-23 09:00:00', 378, 5, 'lucio.fernandez@correo.ucu.edu.uy', 'paga'),
    (9, '2026-06-27 10:40:00', 525, 5, 'maria.lopez@correo.ucu.edu.uy', 'paga'),
    (10, '2026-06-23 10:15:00', 163, 5, 'agostina.etchebarren@correo.ucu.edu.uy', 'confirmada'),
    (11, '2026-06-25 16:30:00', 294, 5, 'camila.santos@correo.ucu.edu.uy', 'pendiente'),
    (12, '2026-06-24 08:45:00', 221, 5, 'rodrigo.gonzalez@correo.ucu.edu.uy', 'confirmada');

-- ------------------------------------------------------------
-- 7.2 Entradas
-- ------------------------------------------------------------

INSERT INTO entrada (
    id_entrada,
    fecha_hora,
    estado,
    codigo_qr,
    costo_total,
    id_compra,
    id_partido,
    nombre_sector,
    id_estadio,
    email_propietario_actual
) OVERRIDING SYSTEM VALUE VALUES

    (1, '2026-06-14 11:30:15', 'activa', 'SEED:FAC-KSA-URU-A-001', 355, 1, 15, 'A', 10, 'facundo.piriz@correo.ucu.edu.uy'),
    (2, '2026-06-14 11:30:20', 'activa', 'SEED:FAC-KSA-URU-B-002', 275, 1, 15, 'B', 10, 'facundo.piriz@correo.ucu.edu.uy'),
    (3, '2026-06-20 12:10:15', 'activa', 'SEED:MAR-URU-CPV-C-001', 215, 2, 39, 'C', 10, 'maria.lopez@correo.ucu.edu.uy'),
    (4, '2026-06-26 18:20:10', 'activa', 'SEED:FAC-URU-MEX-C-001', 270, 3, 76, 'C', 10, 'facundo.piriz@correo.ucu.edu.uy'),
    (5, '2026-06-26 18:35:10', 'activa', 'SEED:AGU-MEX-JPN-A-001', 385, 4, 74, 'A', 14, 'agustin.garciab@correo.ucu.edu.uy'),
    (6, '2026-06-26 19:00:10', 'activa', 'SEED:SOF-CAN-SEN-D-001', 180, 5, 75, 'D', 12, 'sofia.araujo@correo.ucu.edu.uy'),
    (7, '2026-06-26 19:20:10', 'activa', 'SEED:VAL-CPV-KSA-A-001', 350, 6, 63, 'A', 5, 'valentina.martinez@correo.ucu.edu.uy'),
    (8, '2026-06-26 19:20:12', 'activa', 'SEED:VAL-CPV-KSA-B-002', 270, 6, 63, 'B', 5, 'valentina.martinez@correo.ucu.edu.uy'),
    (9, '2026-06-25 14:00:10', 'activa', 'SEED:FEL-URU-CAN-A-001', 390, 7, 73, 'A', 1, 'felipe.paladino@correo.ucu.edu.uy'),
    (10, '2026-06-25 14:00:12', 'activa', 'SEED:FEL-URU-CAN-A-002', 390, 7, 73, 'A', 1, 'felipe.paladino@correo.ucu.edu.uy'),
    (11, '2026-06-25 14:00:14', 'activa', 'SEED:FEL-URU-CAN-B-003', 310, 7, 73, 'B', 1, 'felipe.paladino@correo.ucu.edu.uy'),
    (12, '2026-06-25 14:00:16', 'activa', 'SEED:FEL-URU-CAN-C-004', 250, 7, 73, 'C', 1, 'felipe.paladino@correo.ucu.edu.uy'),
    (13, '2026-06-25 14:00:18', 'activa', 'SEED:FEL-URU-CAN-D-005', 190, 7, 73, 'D', 1, 'felipe.paladino@correo.ucu.edu.uy'),
    (14, '2026-06-23 09:00:20', 'activa', 'SEED:LUC-URU-ESP-A-001', 360, 8, 64, 'A', 15, 'lucio.fernandez@correo.ucu.edu.uy'),
    (15, '2026-06-27 10:40:10', 'activa', 'SEED:MAR-URU-BRA-A-001', 500, 9, 80, 'A', 1, 'maria.lopez@correo.ucu.edu.uy'),
    (16, '2026-06-23 10:15:20', 'activa', 'SEED:AGO-ECU-GER-D-001', 155, 10, 56, 'D', 1, 'agostina.etchebarren@correo.ucu.edu.uy'),
    (17, '2026-06-25 16:30:20', 'activa', 'SEED:CAM-NOR-FRA-B-001', 280, 11, 61, 'B', 11, 'camila.santos@correo.ucu.edu.uy'),
    (18, '2026-06-24 08:45:20', 'activa', 'SEED:ROD-SEN-IRQ-C-001', 210, 12, 62, 'C', 13, 'rodrigo.gonzalez@correo.ucu.edu.uy');

-- Compra cancelada: se mantiene el historial de la compra y la entrada queda cancelada.
UPDATE entrada
SET estado = 'cancelada'
WHERE id_entrada = 18;

UPDATE compra
SET estado = 'cancelada'
WHERE id_compra = 12;

-- ------------------------------------------------------------
-- 7.3 Transferencias
-- ------------------------------------------------------------

-- Lucio -> María, aceptada.
INSERT INTO transferencia (
    id_transferencia,
    fecha_hora,
    email_origen,
    email_destino,
    estado,
    id_entrada
) OVERRIDING SYSTEM VALUE VALUES
    (1, '2026-06-23 11:00:00', 'lucio.fernandez@correo.ucu.edu.uy', 'maria.lopez@correo.ucu.edu.uy', 'pendiente', 14);

UPDATE transferencia
SET estado = 'aceptada', fecha_hora = '2026-06-23 11:05:00'
WHERE id_transferencia = 1;

-- María -> Valentina, aceptada.
INSERT INTO transferencia (
    id_transferencia,
    fecha_hora,
    email_origen,
    email_destino,
    estado,
    id_entrada
) OVERRIDING SYSTEM VALUE VALUES
    (2, '2026-06-23 12:15:00', 'maria.lopez@correo.ucu.edu.uy', 'valentina.martinez@correo.ucu.edu.uy', 'pendiente', 14);

UPDATE transferencia
SET estado = 'aceptada', fecha_hora = '2026-06-23 12:20:00'
WHERE id_transferencia = 2;

-- Valentina -> Rodrigo, queda pendiente para demo de recepción de transferencias.
INSERT INTO transferencia (
    id_transferencia,
    fecha_hora,
    email_origen,
    email_destino,
    estado,
    id_entrada
) OVERRIDING SYSTEM VALUE VALUES
    (3, '2026-06-23 13:30:00', 'valentina.martinez@correo.ucu.edu.uy', 'rodrigo.gonzalez@correo.ucu.edu.uy', 'pendiente', 14);

-- Facundo -> Camila, rechazada.
INSERT INTO transferencia (
    id_transferencia,
    fecha_hora,
    email_origen,
    email_destino,
    estado,
    id_entrada
) OVERRIDING SYSTEM VALUE VALUES
    (4, '2026-06-26 19:30:00', 'facundo.piriz@correo.ucu.edu.uy', 'camila.santos@correo.ucu.edu.uy', 'pendiente', 4);

UPDATE transferencia
SET estado = 'rechazada', fecha_hora = '2026-06-26 19:45:00'
WHERE id_transferencia = 4;

-- Sofía -> Felipe, cancelada por el origen.
INSERT INTO transferencia (
    id_transferencia,
    fecha_hora,
    email_origen,
    email_destino,
    estado,
    id_entrada
) OVERRIDING SYSTEM VALUE VALUES
    (5, '2026-06-26 20:10:00', 'sofia.araujo@correo.ucu.edu.uy', 'felipe.paladino@correo.ucu.edu.uy', 'pendiente', 6);

UPDATE transferencia
SET estado = 'cancelada', fecha_hora = '2026-06-26 20:20:00'
WHERE id_transferencia = 5;

-- ------------------------------------------------------------
-- 7.4 QR finales coherentes con EntradaQrCodeService.GeneratePayload
-- ------------------------------------------------------------
UPDATE entrada
SET codigo_qr =
    'entrada:' || id_entrada::text ||
    '|owner:' || email_propietario_actual ||
    '|ts:' || EXTRACT(EPOCH FROM fecha_hora)::bigint::text ||
    '|nonce:' || md5(id_entrada::text || ':' || email_propietario_actual || ':' || fecha_hora::text)
WHERE codigo_qr LIKE 'SEED:%';

-- ------------------------------------------------------------
-- 7.5 Validaciones históricas de demo
-- ------------------------------------------------------------
-- Se desactiva el trigger solo durante el seed porque estas validaciones
-- representan escaneos históricos de partidos que hoy ya figuran terminados.
-- En runtime el trigger queda activo y mantiene la regla de negocio.

ALTER TABLE valida DISABLE TRIGGER trg_validar_escaneo;

INSERT INTO valida (
    id_validacion,
    id_entrada,
    id_dispositivo,
    estado,
    codigo_escaneado,
    fecha_hora
) OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 1, 'válida', (SELECT codigo_qr FROM entrada WHERE id_entrada = 1), '2026-06-15 20:55:00'),
    (2, 3, 2, 'válida', (SELECT codigo_qr FROM entrada WHERE id_entrada = 3), '2026-06-21 21:05:00'),
    (3, 2, 3, 'inválida', 'entrada:2|owner:facundo.piriz@correo.ucu.edu.uy|ts:0|nonce:00000000000000000000000000000000', '2026-06-15 20:50:00'),
    (4, 2, 3, 'válida', (SELECT codigo_qr FROM entrada WHERE id_entrada = 2), '2026-06-15 21:00:00');

UPDATE entrada
SET estado = 'consumida'
WHERE id_entrada IN (1, 2, 3);

ALTER TABLE valida ENABLE TRIGGER trg_validar_escaneo;

--Insertar aquí los datos de ejemplo en /Carga de entrada para validar.

-- ------------------------------------------------------------
-- 7.6 Recalcular importes finales de compras
-- ------------------------------------------------------------
-- Mantiene el seed alineado con fn_recalcular_monto_compra:
-- monto_total = ROUND(SUM(costo_total) + comisión).
-- Se recalcula al final para cubrir cualquier UPDATE de estado realizado durante el seed.
UPDATE compra c
SET monto_total = ROUND(
    COALESCE((
        SELECT SUM(e.costo_total)
        FROM entrada e
        WHERE e.id_compra = c.id_compra
    ), 0) * (1 + c.porcentaje_comision / 100.0)
)::int;

SELECT setval(
    pg_get_serial_sequence('estadio', 'id_estadio'),
    COALESCE((SELECT MAX(id_estadio) FROM estadio), 1),
    (SELECT COUNT(*) > 0 FROM estadio)
);

SELECT setval(
    pg_get_serial_sequence('dispositivo_escaneo', 'id_dispositivo_escaneo'),
    COALESCE((SELECT MAX(id_dispositivo_escaneo) FROM dispositivo_escaneo), 1),
    (SELECT COUNT(*) > 0 FROM dispositivo_escaneo)
);

SELECT setval(
    pg_get_serial_sequence('partido', 'id_partido'),
    COALESCE((SELECT MAX(id_partido) FROM partido), 1),
    (SELECT COUNT(*) > 0 FROM partido)
);

SELECT setval(
    pg_get_serial_sequence('compra', 'id_compra'),
    COALESCE((SELECT MAX(id_compra) FROM compra), 1),
    (SELECT COUNT(*) > 0 FROM compra)
);

SELECT setval(
    pg_get_serial_sequence('entrada', 'id_entrada'),
    COALESCE((SELECT MAX(id_entrada) FROM entrada), 1),
    (SELECT COUNT(*) > 0 FROM entrada)
);

SELECT setval(
    pg_get_serial_sequence('transferencia', 'id_transferencia'),
    COALESCE((SELECT MAX(id_transferencia) FROM transferencia), 1),
    (SELECT COUNT(*) > 0 FROM transferencia)
);

SELECT setval(
    pg_get_serial_sequence('valida', 'id_validacion'),
    COALESCE((SELECT MAX(id_validacion) FROM valida), 1),
    (SELECT COUNT(*) > 0 FROM valida)
);
