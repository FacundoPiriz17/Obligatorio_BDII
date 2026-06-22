-- ============================================================
-- ROLES / USUARIOS DE CONEXIÓN Y PERMISOS MÍNIMOS
-- ============================================================
--
-- No se eliminan roles existentes para evitar errores por dependencias de privilegios.

-- ------------------------------------------------------------
-- 1. Crear usuarios de conexión si no existen
-- ------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'obligatorio_unlogged') THEN
        CREATE ROLE obligatorio_unlogged WITH LOGIN PASSWORD 'unlogged_pass';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'obligatorio_app') THEN
        CREATE ROLE obligatorio_app WITH LOGIN PASSWORD 'app_pass';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'obligatorio_general') THEN
        CREATE ROLE obligatorio_general WITH LOGIN PASSWORD 'general_pass';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'obligatorio_funcionario') THEN
        CREATE ROLE obligatorio_funcionario WITH LOGIN PASSWORD 'funcionario_pass';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'obligatorio_admin') THEN
        CREATE ROLE obligatorio_admin WITH LOGIN PASSWORD 'admin_pass';
    END IF;
END $$;

ALTER ROLE obligatorio_unlogged WITH LOGIN PASSWORD 'unlogged_pass';
ALTER ROLE obligatorio_app WITH LOGIN PASSWORD 'app_pass';
ALTER ROLE obligatorio_general WITH LOGIN PASSWORD 'general_pass';
ALTER ROLE obligatorio_funcionario WITH LOGIN PASSWORD 'funcionario_pass';
ALTER ROLE obligatorio_admin WITH LOGIN PASSWORD 'admin_pass';

-- ------------------------------------------------------------
-- 2. Permisos base de conexión y esquema
-- ------------------------------------------------------------
GRANT CONNECT ON DATABASE obligatoriobd2 TO
    obligatorio_unlogged,
    obligatorio_app,
    obligatorio_general,
    obligatorio_funcionario,
    obligatorio_admin;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO
    obligatorio_unlogged,
    obligatorio_app,
    obligatorio_general,
    obligatorio_funcionario,
    obligatorio_admin;

GRANT USAGE ON TYPE
    sector_enum,
    fase_enum,
    estado_partido_enum,
    pais_sede_enum,
    estado_entrada_enum,
    estado_validacion_enum,
    estado_compra_enum,
    estado_transferencia_enum
TO obligatorio_app, obligatorio_general, obligatorio_funcionario, obligatorio_admin;

-- ------------------------------------------------------------
-- 3. Usuario no logueado: login y registro público
-- ------------------------------------------------------------
GRANT SELECT ON TABLE
    usuario,
    login,
    general,
    admin,
    funcionario
TO obligatorio_unlogged;

GRANT INSERT ON TABLE
    usuario,
    login,
    general,
    telefonos
TO obligatorio_unlogged;

-- ------------------------------------------------------------
-- 4. Rol app fallback: autenticado sin rol funcional
-- ------------------------------------------------------------
GRANT SELECT ON TABLE
    usuario,
    login,
    general,
    admin,
    funcionario,
    telefonos,
    estadio,
    sector,
    equipo,
    partido,
    partido_sector,
    entrada
TO obligatorio_app;

GRANT UPDATE (contrasena) ON TABLE login TO obligatorio_app;

-- ------------------------------------------------------------
-- 5. Permisos comunes para roles autenticados
-- ------------------------------------------------------------
GRANT SELECT ON TABLE
    usuario,
    login,
    general,
    admin,
    funcionario,
    telefonos,
    estadio,
    sector,
    equipo,
    partido,
    partido_sector,
    entrada
TO obligatorio_general, obligatorio_funcionario, obligatorio_admin;

GRANT UPDATE (contrasena) ON TABLE login
TO obligatorio_general, obligatorio_funcionario, obligatorio_admin;

-- El backend actual reutiliza el mismo UPDATE de usuario para editar perfil.
-- No se concede cambio de email porque es PK y claim de autenticación.
GRANT UPDATE (
    nombre,
    habilitado,
    pais_documento,
    tipo_documento,
    numero_documento,
    localidad_direccion,
    calle_direccion,
    pais_direccion,
    numero_direccion,
    codigo_postal_direccion
) ON TABLE usuario
TO obligatorio_general, obligatorio_funcionario, obligatorio_admin;

GRANT INSERT, DELETE ON TABLE telefonos
TO obligatorio_general, obligatorio_funcionario, obligatorio_admin;

GRANT INSERT (
    modelo,
    installation_id,
    activo,
    email_funcionario
) ON TABLE dispositivo_escaneo
TO obligatorio_funcionario;

GRANT USAGE ON SEQUENCE dispositivo_escaneo_id_dispositivo_escaneo_seq
TO obligatorio_funcionario;
-- ------------------------------------------------------------
-- 6. Usuario General: compras, entradas y transferencias
-- ------------------------------------------------------------
GRANT SELECT ON TABLE
    compra,
    transferencia,
    valida,
    dispositivo_escaneo
TO obligatorio_general;

GRANT INSERT ON TABLE
    compra,
    entrada,
    transferencia
TO obligatorio_general;

GRANT UPDATE (estado, monto_total) ON TABLE compra TO obligatorio_general;

GRANT UPDATE (
    estado,
    codigo_qr,
    email_propietario_actual,
    transferencias_restantes
) ON TABLE entrada TO obligatorio_general;

GRANT UPDATE (estado) ON TABLE transferencia TO obligatorio_general;

GRANT USAGE ON SEQUENCE
    compra_id_compra_seq,
    entrada_id_entrada_seq,
    transferencia_id_transferencia_seq
TO obligatorio_general;

GRANT EXECUTE ON FUNCTION fn_preparar_entrada() TO obligatorio_general;
GRANT EXECUTE ON FUNCTION fn_recalcular_monto_compra(INT) TO obligatorio_general;
GRANT EXECUTE ON FUNCTION fn_trigger_recalcular_monto_compra() TO obligatorio_general;
GRANT EXECUTE ON FUNCTION fn_validar_transferencia() TO obligatorio_general;
GRANT EXECUTE ON FUNCTION fn_aplicar_transferencia_aceptada() TO obligatorio_general;

-- ------------------------------------------------------------
-- 7. Funcionario: validaciones y dispositivos
-- ------------------------------------------------------------
GRANT SELECT ON TABLE
    compra,
    transferencia,
    valida,
    dispositivo_escaneo
TO obligatorio_funcionario;

GRANT INSERT ON TABLE valida TO obligatorio_funcionario;

-- El trigger de validación marca la entrada como consumida.
GRANT UPDATE (estado) ON TABLE entrada TO obligatorio_funcionario;

GRANT USAGE ON SEQUENCE valida_id_validacion_seq TO obligatorio_funcionario;

GRANT EXECUTE ON FUNCTION fn_validar_escaneo() TO obligatorio_funcionario;

-- ------------------------------------------------------------
-- 8. Administrador: infraestructura, eventos, usuarios y reportes
-- ------------------------------------------------------------
GRANT SELECT ON TABLE
    compra,
    transferencia,
    valida,
    dispositivo_escaneo
TO obligatorio_admin;

GRANT INSERT, UPDATE ON TABLE estadio TO obligatorio_admin;
GRANT INSERT, UPDATE ON TABLE sector TO obligatorio_admin;
GRANT INSERT, UPDATE ON TABLE dispositivo_escaneo TO obligatorio_admin;

GRANT INSERT, UPDATE ON TABLE partido TO obligatorio_admin;
GRANT INSERT, DELETE ON TABLE partido_sector TO obligatorio_admin;

GRANT INSERT ON TABLE
    usuario,
    login,
    telefonos,
    admin,
    funcionario,
    general
TO obligatorio_admin;

GRANT UPDATE ON TABLE usuario TO obligatorio_admin;
GRANT UPDATE ON TABLE admin TO obligatorio_admin;
GRANT UPDATE ON TABLE funcionario TO obligatorio_admin;
GRANT UPDATE ON TABLE general TO obligatorio_admin;

GRANT DELETE ON TABLE
    telefonos,
    admin,
    funcionario,
    general
TO obligatorio_admin;

GRANT USAGE ON SEQUENCE
    estadio_id_estadio_seq,
    partido_id_partido_seq,
    dispositivo_escaneo_id_dispositivo_escaneo_seq
TO obligatorio_admin;

GRANT EXECUTE ON FUNCTION fn_validar_admin_pais_partido() TO obligatorio_admin;
GRANT EXECUTE ON FUNCTION fn_validar_admin_pais_estadio() TO obligatorio_admin;