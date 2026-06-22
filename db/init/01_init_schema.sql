-- Descomentar para Crear la BD, luego tocar arriba a la derecha el schema del obligatorio
-- DROP DATABASE IF EXISTS obligatoriobd2;
-- CREATE DATABASE obligatoriobd2;

DROP TABLE IF EXISTS valida CASCADE;
DROP TABLE IF EXISTS partido_sector CASCADE;
DROP TABLE IF EXISTS transferencia CASCADE;
DROP TABLE IF EXISTS entrada CASCADE;
DROP TABLE IF EXISTS compra CASCADE;
DROP TABLE IF EXISTS dispositivo_escaneo CASCADE;
DROP TABLE IF EXISTS general CASCADE;
DROP TABLE IF EXISTS funcionario CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS login CASCADE;
DROP TABLE IF EXISTS telefonos CASCADE;
DROP TABLE IF EXISTS partido CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS equipo CASCADE;
DROP TABLE IF EXISTS sector CASCADE;
DROP TABLE IF EXISTS estadio CASCADE;

DROP TYPE IF EXISTS sector_enum CASCADE;
DROP TYPE IF EXISTS fase_enum CASCADE;
DROP TYPE IF EXISTS estado_partido_enum CASCADE;
DROP TYPE IF EXISTS pais_sede_enum CASCADE;
DROP TYPE IF EXISTS estado_entrada_enum CASCADE;
DROP TYPE IF EXISTS estado_validacion_enum CASCADE;
DROP TYPE IF EXISTS estado_compra_enum CASCADE;
DROP TYPE IF EXISTS estado_transferencia_enum CASCADE;

CREATE TYPE sector_enum AS ENUM (
    'A',
    'B',
    'C',
    'D'
    );

CREATE TYPE fase_enum AS ENUM (
    'Fase de grupos',
    'Dieciseisavos de final',
    'Octavos de final',
    'Cuartos de final',
    'Semifinal',
    'Final'
    );

CREATE TYPE estado_partido_enum AS ENUM (
    'terminado',
    'empezado',
    'no empezado'
    );

CREATE TYPE pais_sede_enum AS ENUM (
    'México',
    'EEUU',
    'Canadá'
    );

CREATE TYPE estado_entrada_enum AS ENUM (
    'activa',
    'consumida',
    'cancelada'
    );

CREATE TYPE estado_validacion_enum AS ENUM (
    'válida',
    'inválida'
    );

CREATE TYPE estado_compra_enum AS ENUM (
    'pendiente',
    'confirmada',
    'cancelada',
    'paga'
    );

CREATE TYPE estado_transferencia_enum AS ENUM (
    'pendiente',
    'aceptada',
    'rechazada',
    'cancelada'
    );

CREATE TABLE estadio (
                         id_estadio INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         nombre_estadio VARCHAR(32) NOT NULL,
                         capacidad INT,
                         ubicacion VARCHAR(40),
                         ciudad VARCHAR(32),
                         pais pais_sede_enum NOT NULL,

                         CHECK (CHAR_LENGTH(nombre_estadio) >= 3),
                         CHECK (capacidad IS NULL OR capacidad > 0)
);

CREATE TABLE sector (
                        nombre_sector sector_enum,
                        capacidad INT,
                        id_estadio INT,
                        costo INT,

                        PRIMARY KEY (nombre_sector, id_estadio),
                        CHECK (capacidad IS NULL OR capacidad > 0),
                        CHECK (costo IS NULL OR costo >= 0),
                        FOREIGN KEY (id_estadio) REFERENCES estadio(id_estadio)
);

CREATE TABLE equipo (
                        codigo_fifa CHAR(3) PRIMARY KEY,
                        nombre_equipo VARCHAR(32) NOT NULL,
                        grupo CHAR(1) NOT NULL,

                        CHECK (CHAR_LENGTH(codigo_fifa) = 3),
                        CHECK (codigo_fifa = UPPER(codigo_fifa)),
                        CHECK (CHAR_LENGTH(nombre_equipo) >= 3),
                        CHECK (grupo IN ('A','B','C','D','E','F','G','H','I','J','K','L'))

);

CREATE TABLE usuario (
                         email VARCHAR(100) PRIMARY KEY CHECK (
                             LOWER(email) LIKE '%@correo.ucu.edu.uy'
                                 OR LOWER(email) LIKE '%@ucu.edu.uy'
                             ),
                         nombre VARCHAR(32) NOT NULL,
                         habilitado BOOLEAN NOT NULL,
                         pais_documento VARCHAR(32) NOT NULL,
                         tipo_documento VARCHAR(32) NOT NULL,
                         numero_documento INT NOT NULL,
                         localidad_direccion VARCHAR(40),
                         calle_direccion VARCHAR(50),
                         pais_direccion VARCHAR(32),
                         numero_direccion INT,
                         codigo_postal_direccion INT,

                         CHECK (CHAR_LENGTH(nombre) >= 3),
                         CHECK (numero_documento > 0),
                         CHECK (numero_direccion IS NULL OR numero_direccion > 0),
                         CHECK (codigo_postal_direccion IS NULL OR codigo_postal_direccion > 0),
                         UNIQUE (pais_documento, tipo_documento, numero_documento)
);

CREATE TABLE telefonos (
                           email_usuario VARCHAR(100),
                           telefono VARCHAR(20) NOT NULL,

                           PRIMARY KEY (email_usuario, telefono),
                           FOREIGN KEY (email_usuario) REFERENCES usuario(email)
);

CREATE TABLE login (
                       email VARCHAR(100) PRIMARY KEY,
                       contrasena VARCHAR(255) NOT NULL,

                       FOREIGN KEY (email) REFERENCES usuario(email)
);

CREATE TABLE admin (
                       email_admin VARCHAR(100) PRIMARY KEY,
                       fecha_asignacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       pais pais_sede_enum NOT NULL,

                       FOREIGN KEY (email_admin) REFERENCES usuario(email)
);

CREATE TABLE funcionario (
                             email_funcionario VARCHAR(100) PRIMARY KEY,
                             numero_legajo INT UNIQUE NOT NULL,

                             CHECK (numero_legajo > 0),
                             FOREIGN KEY (email_funcionario) REFERENCES usuario(email)
);

CREATE TABLE general (
                         email_general VARCHAR(100) PRIMARY KEY,
                         fecha_registro TIMESTAMP,
                         estado_verificacion BOOLEAN,
                         FOREIGN KEY (email_general) REFERENCES usuario(email)
);

CREATE TABLE partido (
                         id_partido INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         fecha DATE NOT NULL,
                         hora TIME NOT NULL,
                         id_estadio INT NOT NULL,
                         equipo_visitante CHAR(3) NOT NULL,
                         equipo_local CHAR(3) NOT NULL,
                         marcador_local INT NOT NULL DEFAULT 0,
                         marcador_visitante INT NOT NULL DEFAULT 0,
                         costo INT NOT NULL DEFAULT 0,
                         fase fase_enum NOT NULL,
                         estado estado_partido_enum NOT NULL DEFAULT 'no empezado',
                         email_admin VARCHAR(100) NOT NULL ,
                         fecha_habilitacion DATE DEFAULT CURRENT_DATE,

                         CHECK (costo >= 0),
                         CHECK (equipo_visitante <> equipo_local),
                         CHECK (fecha_habilitacion <= fecha - INTERVAL '1 day'),
                         FOREIGN KEY (id_estadio) REFERENCES estadio(id_estadio),
                         FOREIGN KEY (equipo_visitante) REFERENCES equipo(codigo_fifa),
                         FOREIGN KEY (equipo_local) REFERENCES equipo(codigo_fifa),
                         FOREIGN KEY (email_admin) REFERENCES admin(email_admin),

                         UNIQUE (id_estadio, fecha, hora),
                         UNIQUE (id_partido, id_estadio)
);

CREATE TABLE dispositivo_escaneo (
                                     id_dispositivo_escaneo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                     modelo VARCHAR(30),
                                     activo BOOLEAN NOT NULL,
                                     email_funcionario VARCHAR(100) NOT NULL,
                                     installation_id VARCHAR(64) UNIQUE,


                                    CHECK (
                                        installation_id IS NULL
                                        OR CHAR_LENGTH(installation_id) BETWEEN 16 AND 64
                                    ),
                                     FOREIGN KEY (email_funcionario) REFERENCES funcionario(email_funcionario)
);

CREATE TABLE compra (
                        id_compra INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        monto_total INT NOT NULL DEFAULT 0,
                        porcentaje_comision DOUBLE PRECISION NOT NULL DEFAULT 5,
                        email_usuario VARCHAR(100) NOT NULL,
                        estado estado_compra_enum NOT NULL DEFAULT 'pendiente',

                        CHECK (monto_total >= 0),
                        CHECK (porcentaje_comision >= 0),
                        FOREIGN KEY (email_usuario) REFERENCES general(email_general)
);

CREATE TABLE partido_sector (
                                id_partido INT,
                                nombre_sector sector_enum,
                                id_estadio INT,

                                PRIMARY KEY (id_partido, nombre_sector, id_estadio),
                                FOREIGN KEY (id_partido, id_estadio)
                                    REFERENCES partido(id_partido, id_estadio),

                                FOREIGN KEY (nombre_sector, id_estadio)
                                    REFERENCES sector(nombre_sector, id_estadio)
);

CREATE TABLE entrada (
                         id_entrada INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         estado estado_entrada_enum NOT NULL DEFAULT 'activa',
                         codigo_qr VARCHAR(300),
                         costo_total INT NOT NULL,
                         transferencias_restantes INT NOT NULL DEFAULT 3,
                         id_compra INT NOT NULL,
                         id_partido INT NOT NULL,
                         nombre_sector sector_enum NOT NULL,
                         id_estadio INT NOT NULL,
                         email_propietario_actual VARCHAR(100) NOT NULL,

                         CHECK (costo_total >= 0),
                         CHECK (transferencias_restantes BETWEEN 0 AND 3),

                         FOREIGN KEY (id_compra) REFERENCES compra(id_compra),

                         FOREIGN KEY (id_partido, nombre_sector, id_estadio)
                             REFERENCES partido_sector(id_partido, nombre_sector, id_estadio),

                         FOREIGN KEY (email_propietario_actual)
                             REFERENCES general(email_general)
);

CREATE TABLE transferencia (
                               id_transferencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                               fecha_hora TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               email_origen VARCHAR(100) NOT NULL,
                               email_destino VARCHAR(100) NOT NULL,
                               estado estado_transferencia_enum NOT NULL DEFAULT 'pendiente',
                               id_entrada INT NOT NULL,

                               CHECK (email_origen <> email_destino),

                               FOREIGN KEY (email_origen) REFERENCES general(email_general),
                               FOREIGN KEY (email_destino) REFERENCES general(email_general),
                               FOREIGN KEY (id_entrada) REFERENCES entrada(id_entrada)
);

CREATE TABLE valida (
                        id_validacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        id_entrada INT NOT NULL,
                        id_dispositivo INT NOT NULL,
                        estado estado_validacion_enum NOT NULL,
                        codigo_escaneado VARCHAR(300) NOT NULL,
                        fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        FOREIGN KEY (id_entrada) REFERENCES entrada(id_entrada),
                        FOREIGN KEY (id_dispositivo) REFERENCES dispositivo_escaneo(id_dispositivo_escaneo)
);

CREATE UNIQUE INDEX ux_transferencia_pendiente_por_entrada
    ON transferencia(id_entrada)
    WHERE estado = 'pendiente';

CREATE UNIQUE INDEX ux_validacion_valida_por_entrada
    ON valida(id_entrada)
    WHERE estado = 'válida';

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- 1. Controlar que el administrador solo gestione partidos de su país sede.

CREATE OR REPLACE FUNCTION fn_validar_admin_pais_partido()
    RETURNS TRIGGER AS $$
DECLARE
    v_pais_admin pais_sede_enum;
    v_pais_estadio pais_sede_enum;
    v_email_sesion TEXT;
    v_pais_admin_sesion pais_sede_enum;
    v_pais_estadio_anterior pais_sede_enum;
BEGIN
    SELECT pais
    INTO v_pais_admin
    FROM admin
    WHERE LOWER(email_admin) = LOWER(NEW.email_admin);

    SELECT pais
    INTO v_pais_estadio
    FROM estadio
    WHERE id_estadio = NEW.id_estadio;

    IF v_pais_admin IS NULL THEN
        RAISE EXCEPTION 'El administrador % no existe.', NEW.email_admin;
    END IF;

    IF v_pais_estadio IS NULL THEN
        RAISE EXCEPTION 'El estadio % no existe.', NEW.id_estadio;
    END IF;

    IF v_pais_admin <> v_pais_estadio THEN
        RAISE EXCEPTION
            'El administrador % pertenece a %, pero el estadio pertenece a %.',
            NEW.email_admin, v_pais_admin, v_pais_estadio;
    END IF;

    IF current_user = 'obligatorio_admin' THEN
        v_email_sesion := NULLIF(current_setting('app.current_email', TRUE), '');

        IF v_email_sesion IS NULL THEN
            RAISE EXCEPTION 'No se pudo identificar el administrador de la sesión.';
        END IF;

        SELECT pais
        INTO v_pais_admin_sesion
        FROM admin
        WHERE LOWER(email_admin) = LOWER(v_email_sesion);

        IF v_pais_admin_sesion IS NULL THEN
            RAISE EXCEPTION 'El administrador de sesión % no existe.', v_email_sesion;
        END IF;

        IF TG_OP = 'UPDATE' THEN
            SELECT pais
            INTO v_pais_estadio_anterior
            FROM estadio
            WHERE id_estadio = OLD.id_estadio;

            IF v_pais_admin_sesion <> v_pais_estadio_anterior THEN
                RAISE EXCEPTION
                    'No puede editar un partido de otra jurisdicción. Administrador: %, partido actual: %.',
                    v_pais_admin_sesion, v_pais_estadio_anterior;
            END IF;
        END IF;

        IF v_pais_admin_sesion <> v_pais_estadio THEN
            RAISE EXCEPTION
                'No puede asignar el partido a un estadio de otra jurisdicción. Administrador: %, estadio: %.',
                v_pais_admin_sesion, v_pais_estadio;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_admin_pais_partido
    BEFORE INSERT OR UPDATE ON partido
    FOR EACH ROW
EXECUTE FUNCTION fn_validar_admin_pais_partido();

-- 2. Controlar que el administrador solo cree o edite estadios de su país sede.

CREATE OR REPLACE FUNCTION fn_validar_admin_pais_estadio()
    RETURNS TRIGGER AS $$
DECLARE
    v_email_sesion TEXT;
    v_pais_admin pais_sede_enum;
BEGIN

    IF current_user <> 'obligatorio_admin' THEN
        RETURN NEW;
    END IF;

    v_email_sesion := NULLIF(current_setting('app.current_email', TRUE), '');

    IF v_email_sesion IS NULL THEN
        RAISE EXCEPTION 'No se pudo identificar el administrador de la sesión.';
    END IF;

    SELECT pais
    INTO v_pais_admin
    FROM admin
    WHERE LOWER(email_admin) = LOWER(v_email_sesion);

    IF v_pais_admin IS NULL THEN
        RAISE EXCEPTION 'El administrador de sesión % no existe.', v_email_sesion;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF OLD.pais <> v_pais_admin THEN
            RAISE EXCEPTION
                'No puede editar un estadio de otra jurisdicción. Administrador: %, estadio actual: %.',
                v_pais_admin, OLD.pais;
        END IF;

        IF NEW.pais <> OLD.pais THEN
            RAISE EXCEPTION 'No se puede cambiar el país sede de un estadio existente.';
        END IF;
    END IF;

    IF NEW.pais <> v_pais_admin THEN
        RAISE EXCEPTION
            'No puede crear o editar estadios fuera de su jurisdicción. Administrador: %, estadio: %.',
            v_pais_admin, NEW.pais;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_admin_pais_estadio
    BEFORE INSERT OR UPDATE ON estadio
    FOR EACH ROW
EXECUTE FUNCTION fn_validar_admin_pais_estadio();

-- 2. Preparar entrada:
--    - máximo 5 entradas por compra
--    - no superar capacidad del sector
--    - asignar propietario inicial al comprador
--    - calcular costo_total si no corresponde

CREATE OR REPLACE FUNCTION fn_preparar_entrada()
    RETURNS TRIGGER AS $$
DECLARE
    v_cantidad_entradas_compra INT;
    v_entradas_emitidas_sector INT;
    v_capacidad_sector INT;
    v_email_comprador VARCHAR(100);
    v_costo_sector INT;
    v_costo_partido INT;
BEGIN
    SELECT COUNT(*)
    INTO v_cantidad_entradas_compra
    FROM entrada
    WHERE id_compra = NEW.id_compra
      AND (TG_OP = 'INSERT' OR id_entrada <> NEW.id_entrada);

    IF v_cantidad_entradas_compra >= 5 THEN
        RAISE EXCEPTION
            'No se pueden comprar más de 5 entradas en la misma compra. Compra: %',
            NEW.id_compra;
    END IF;

    SELECT COUNT(*)
    INTO v_entradas_emitidas_sector
    FROM entrada
    WHERE id_partido = NEW.id_partido
      AND nombre_sector = NEW.nombre_sector
      AND id_estadio = NEW.id_estadio
      AND (TG_OP = 'INSERT' OR id_entrada <> NEW.id_entrada);

    SELECT capacidad, costo
    INTO v_capacidad_sector, v_costo_sector
    FROM sector
    WHERE nombre_sector = NEW.nombre_sector
      AND id_estadio = NEW.id_estadio;

    IF v_capacidad_sector IS NULL THEN
        RAISE EXCEPTION
            'No existe el sector % para el estadio %.',
            NEW.nombre_sector, NEW.id_estadio;
    END IF;

    IF v_entradas_emitidas_sector >= v_capacidad_sector THEN
        RAISE EXCEPTION
            'No hay capacidad disponible en el sector % del estadio % para el partido %.',
            NEW.nombre_sector, NEW.id_estadio, NEW.id_partido;
    END IF;

    SELECT email_usuario
    INTO v_email_comprador
    FROM compra
    WHERE id_compra = NEW.id_compra;

    IF v_email_comprador IS NULL THEN
        RAISE EXCEPTION 'La compra % no existe.', NEW.id_compra;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.email_propietario_actual := v_email_comprador;
    END IF;

    SELECT costo
    INTO v_costo_partido
    FROM partido
    WHERE id_partido = NEW.id_partido;

    IF NEW.costo_total IS NULL THEN
        NEW.costo_total := COALESCE(v_costo_sector, 0) + COALESCE(v_costo_partido, 0);
    END IF;

    IF NEW.transferencias_restantes IS NULL THEN
        NEW.transferencias_restantes := 3;
    END IF;

    IF NEW.estado IS NULL THEN
        NEW.estado := 'activa';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_preparar_entrada
    BEFORE INSERT OR UPDATE ON entrada
    FOR EACH ROW
EXECUTE FUNCTION fn_preparar_entrada();


-- 3. Recalcular monto total de compra con comisión.

CREATE OR REPLACE FUNCTION fn_recalcular_monto_compra(p_id_compra INT)
    RETURNS VOID AS $$
DECLARE
    v_subtotal INT;
    v_comision DOUBLE PRECISION;
BEGIN
    SELECT COALESCE(SUM(costo_total), 0)
    INTO v_subtotal
    FROM entrada
    WHERE id_compra = p_id_compra;

    SELECT porcentaje_comision
    INTO v_comision
    FROM compra
    WHERE id_compra = p_id_compra;

    UPDATE compra
    SET monto_total = ROUND(v_subtotal + (v_subtotal * v_comision / 100.0))
    WHERE id_compra = p_id_compra;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_trigger_recalcular_monto_compra()
    RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM fn_recalcular_monto_compra(OLD.id_compra);
        RETURN OLD;
    END IF;

    PERFORM fn_recalcular_monto_compra(NEW.id_compra);

    IF TG_OP = 'UPDATE' AND OLD.id_compra <> NEW.id_compra THEN
        PERFORM fn_recalcular_monto_compra(OLD.id_compra);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalcular_monto_compra
    AFTER INSERT OR UPDATE OR DELETE ON entrada
    FOR EACH ROW
EXECUTE FUNCTION fn_trigger_recalcular_monto_compra();


-- 4. Validar transferencias antes de insertarlas o aceptarlas.

CREATE OR REPLACE FUNCTION fn_validar_transferencia()
    RETURNS TRIGGER AS $$
DECLARE
    v_propietario_actual VARCHAR(100);
    v_estado_entrada estado_entrada_enum;
    v_transferencias_restantes INT;
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.estado = 'aceptada' THEN
        RAISE EXCEPTION
            'No se puede modificar una transferencia ya aceptada.';
    END IF;

    SELECT email_propietario_actual, estado, transferencias_restantes
    INTO v_propietario_actual, v_estado_entrada, v_transferencias_restantes
    FROM entrada
    WHERE id_entrada = NEW.id_entrada
        FOR UPDATE;

    IF v_propietario_actual IS NULL THEN
        RAISE EXCEPTION 'La entrada % no existe.', NEW.id_entrada;
    END IF;

    IF v_estado_entrada = 'consumida' THEN
        RAISE EXCEPTION
            'La entrada % ya fue consumida y no puede transferirse.',
            NEW.id_entrada;
    END IF;

    IF NEW.email_origen <> v_propietario_actual THEN
        RAISE EXCEPTION
            'El usuario % no es el propietario actual de la entrada %. Propietario actual: %.',
            NEW.email_origen, NEW.id_entrada, v_propietario_actual;
    END IF;

    IF NEW.estado = 'aceptada' AND v_transferencias_restantes <= 0 THEN
        RAISE EXCEPTION
            'La entrada % ya no tiene transferencias disponibles.',
            NEW.id_entrada;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_transferencia
    BEFORE INSERT OR UPDATE ON transferencia
    FOR EACH ROW
EXECUTE FUNCTION fn_validar_transferencia();


-- 5. Aplicar transferencia aceptada:
--    cambia propietario y descuenta transferencia restante.

CREATE OR REPLACE FUNCTION fn_aplicar_transferencia_aceptada()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'aceptada'
        AND (TG_OP = 'INSERT' OR OLD.estado <> 'aceptada') THEN

        UPDATE entrada
        SET email_propietario_actual = NEW.email_destino,
            transferencias_restantes = transferencias_restantes - 1
        WHERE id_entrada = NEW.id_entrada;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_aplicar_transferencia_aceptada
    AFTER INSERT OR UPDATE ON transferencia
    FOR EACH ROW
EXECUTE FUNCTION fn_aplicar_transferencia_aceptada();


-- 6. Validar escaneo de entrada:
--    - dispositivo activo
--    - entrada no consumida
--    - QR escaneado coincide con QR actual
--    - si es válida, marca la entrada como consumida

CREATE OR REPLACE FUNCTION fn_validar_escaneo()
    RETURNS TRIGGER AS $$
DECLARE
    v_estado_entrada estado_entrada_enum;
    v_codigo_qr VARCHAR(300);
    v_dispositivo_activo BOOLEAN;

    v_id_partido INTEGER;
    v_estado_partido estado_partido_enum;
    v_fecha_partido DATE;
BEGIN
    SELECT estado, codigo_qr, id_partido
    INTO v_estado_entrada, v_codigo_qr, v_id_partido
    FROM entrada
    WHERE id_entrada = NEW.id_entrada
    FOR UPDATE;

    IF v_estado_entrada IS NULL THEN
        RAISE EXCEPTION 'La entrada % no existe.', NEW.id_entrada;
    END IF;

    IF v_estado_entrada = 'consumida' THEN
        RAISE EXCEPTION
            'La entrada % ya fue consumida. No puede volver a validarse.',
            NEW.id_entrada;
    END IF;

    SELECT activo
    INTO v_dispositivo_activo
    FROM dispositivo_escaneo
    WHERE id_dispositivo_escaneo = NEW.id_dispositivo;

    IF v_dispositivo_activo IS NULL THEN
        RAISE EXCEPTION
            'El dispositivo de escaneo % no existe.',
            NEW.id_dispositivo;
    END IF;

    IF v_dispositivo_activo = FALSE THEN
        RAISE EXCEPTION
            'El dispositivo de escaneo % no está activo.',
            NEW.id_dispositivo;
    END IF;

    IF NEW.estado = 'válida' THEN

        SELECT estado, fecha
        INTO v_estado_partido, v_fecha_partido
        FROM partido
        WHERE id_partido = v_id_partido;

        IF v_estado_partido IS NULL THEN
            RAISE EXCEPTION
                'El partido asociado a la entrada % no existe.',
                NEW.id_entrada;
        END IF;

        IF v_estado_partido = 'terminado' THEN
            RAISE EXCEPTION
                'No se puede validar la entrada %. El partido ya finalizó.',
                NEW.id_entrada;
        END IF;

        IF v_fecha_partido < CURRENT_DATE THEN
            RAISE EXCEPTION
                'No se puede validar la entrada %. La fecha del partido ya pasó.',
                NEW.id_entrada;
        END IF;

        IF v_estado_partido = 'no empezado' THEN
            RAISE EXCEPTION
                'No se puede validar la entrada %. El partido todavía no empezó.',
                NEW.id_entrada;
        END IF;

        IF NEW.codigo_escaneado IS DISTINCT FROM v_codigo_qr THEN
            RAISE EXCEPTION
                'El código escaneado no coincide con el QR actual de la entrada %. La validación no puede marcarse como válida.',
                NEW.id_entrada;
        END IF;

        UPDATE entrada
        SET estado = 'consumida'
        WHERE id_entrada = NEW.id_entrada;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_escaneo
    BEFORE INSERT ON valida
    FOR EACH ROW
EXECUTE FUNCTION fn_validar_escaneo();

-- ============================================================
