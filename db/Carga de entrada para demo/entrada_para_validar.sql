-- ------------------------------------------------------------
-- 7.X Demo validación funcionario: entrada activa para partido de HOY
-- ------------------------------------------------------------
-- Objetivo:
-- - Crear un partido con fecha CURRENT_DATE para que sea válido en la demo.
-- - La fecha_habilitacion queda en el día anterior.
-- - Se crea una compra paga para Facundo.
-- - Se crea una entrada activa, con QR coherente con EntradaQrCodeService.
--
-- Para probar:
-- - Usuario dueño: facundo.piriz@correo.ucu.edu.uy
-- - Funcionario sugerido: fabrizio.rodriguez@correo.ucu.edu.uy
-- - Dispositivo activo sugerido: id_dispositivo_escaneo = 1
--
-- Hora del partido:
-- - Cambiar TIME '20:00' si querés otra hora para la demo.
-- ------------------------------------------------------------

INSERT INTO partido (
    id_partido,
    fecha,
    hora,
    id_estadio,
    equipo_visitante,
    equipo_local,
    marcador_local,
    marcador_visitante,
    costo,
    fase,
    estado,
    email_admin,
    fecha_habilitacion
) OVERRIDING SYSTEM VALUE VALUES
    (
        81,
        CURRENT_DATE,
        TIME '20:00', -- CAMBIAR HORA DE EJEMPLO SI HACE FALTA
        10,
        'ARG',
        'ESP',
        0,
        0,
        90,
        'Dieciseisavos de final',
        'empezado',
        'diego.deoliveira@correo.ucu.edu.uy',
        CURRENT_DATE - 1
    );

-- Habilita los sectores del partido demo.
-- Usamos el estadio 10, que ya tiene sectores A/B/C/D cargados.
INSERT INTO partido_sector (
    id_partido,
    nombre_sector,
    id_estadio
) VALUES
    (81, 'A', 10),
    (81, 'B', 10),
    (81, 'C', 10),
    (81, 'D', 10);

-- Compra paga de Facundo.
-- Entrada sector A:
-- costo partido = 90
-- costo sector A estadio 10 = 300
-- costo_total entrada = 390
-- comisión 5% => ROUND(390 * 1.05) = 410
INSERT INTO compra (
    id_compra,
    fecha_hora,
    monto_total,
    porcentaje_comision,
    email_usuario,
    estado
) OVERRIDING SYSTEM VALUE VALUES
    (
        13,
        CURRENT_DATE - 1 + TIME '10:00',
        410,
        5,
        'facundo.piriz@correo.ucu.edu.uy',
        'paga'
    );

-- Entrada activa para el partido de hoy.
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
    (
        19,
        CURRENT_DATE - 1 + TIME '10:05',
        'activa',
        NULL,
        390,
        13,
        81,
        'A',
        10,
        'facundo.piriz@correo.ucu.edu.uy'
    );
