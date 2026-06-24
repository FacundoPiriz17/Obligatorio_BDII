# Backend_BDII

Backend del sistema de ticketing del **Mundial 2026** para el obligatorio de **Bases de Datos II**.

Expone una API REST desarrollada en **.NET 10**, conectada a **PostgreSQL** mediante **Npgsql** y consultas SQL directas. No se utiliza ORM.  
La API centraliza autenticación, roles, compras, entradas, transferencias, eventos, infraestructura, validaciones y reportes.

---

## Stack

| Área | Tecnología / Librería |
|---|---|
| Framework | ASP.NET Core / .NET 10 |
| Base de datos | PostgreSQL 16 |
| Acceso a datos | Npgsql |
| Autenticación | JWT Bearer |
| Hash de contraseñas | BCrypt.Net-Next |
| Validaciones | FluentValidation.AspNetCore |
| QR | QRCoder |
| Logs | Serilog + Serilog.Sinks.Console |
| Documentación API | Swagger / Swashbuckle |
| Docker | Dockerfile.dev + docker-compose |

---

## Variables de entorno principales

En Docker, estas variables ya están configuradas dentro de `docker-compose.yaml`.

| Variable | Descripción |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | Entorno de ejecución. En Docker se usa `Development`. |
| `ASPNETCORE_URLS` | URL interna donde escucha el backend. En Docker se usa `http://+:5293`. |
| `ConnectionStrings__UnloggedConnection` | Conexión usada antes de iniciar sesión. |
| `ConnectionStrings__GeneralConnection` | Conexión usada para usuarios con rol General. |
| `ConnectionStrings__FuncionarioConnection` | Conexión usada para funcionarios. |
| `ConnectionStrings__AdminConnection` | Conexión usada para administradores. |
| `ConnectionStrings__AppConnection` | Conexión general de aplicación. |
| `Jwt__Issuer` | Emisor del token JWT. |
| `Jwt__Audience` | Audiencia del token JWT. |
| `Jwt__Key` | Clave de firma del token JWT. |
| `Jwt__ExpirationMinutes` | Duración del token en minutos. |

---

## Puertos

| Servicio | Puerto |
|---|---|
| Backend | `5293` |
| Swagger | `5293/swagger` |
| PostgreSQL, desde host | `5433` |
| PostgreSQL, dentro de Docker | `5432` |

---

## Estructura del proyecto

```text
Backend_BDII/
├── Backend_BDII.sln
├── Dockerfile.dev
├── global.json
└── Backend_BDII/
    ├── Program.cs
    ├── appsettings.json
    ├── Common/
    │   ├── Auditing/
    │   ├── Database/
    │   ├── Domain/
    │   ├── Json/
    │   ├── Responses/
    │   ├── Security/
    │   └── Validators/
    └── Modules/
        ├── Auth/
        ├── Compras/
        ├── Entradas/
        ├── Eventos/
        ├── Home/
        ├── Infraestructura/
        ├── Reportes/
        ├── Transferencias/
        ├── Usuarios/
        └── Validaciones/
```

---

## Arquitectura general

El backend está organizado por módulos funcionales. Cada módulo suele separar:

- `Controllers`: endpoints HTTP.
- `DTOs`: objetos de entrada y salida.
- `Repositories`: acceso directo a PostgreSQL mediante SQL y Npgsql.
- `Services`: lógica de aplicación y coordinación de operaciones.

La carpeta `Common` agrupa componentes transversales:

| Carpeta | Responsabilidad |
|---|---|
| `Common/Database` | Factory de conexiones según rol del usuario autenticado. |
| `Common/Security` | JWT, BCrypt y generación de QR. |
| `Common/Validators` | Validaciones con FluentValidation. |
| `Common/Auditing` | Registro de eventos relevantes para auditoría. |
| `Common/Responses` | Formato común de respuestas de error. |
| `Common/Json` | Conversores para `DateOnly`, `TimeOnly` y `DateTime`. |
| `Common/Domain` | Utilidades de dominio, como normalización de país sede. |

---

## Módulos principales

| Módulo | Responsabilidad |
|---|---|
| `Auth` | Registro, login, refresh de sesión, cambio de contraseña y perfil autenticado. |
| `Usuarios` | Perfil propio y administración de usuarios, roles y habilitación. |
| `Infraestructura` | Estadios, sectores, equipos y dispositivos de escaneo. |
| `Eventos` | Listado, alta, modificación y cambio de estado de partidos. |
| `Compras` | Compra de entradas, confirmación, pago, cancelación y generación de QR. |
| `Entradas` | Detalle de entrada, vista de wallet y cadena de custodia. |
| `Transferencias` | Crear, aceptar, rechazar y cancelar transferencias. |
| `Validaciones` | Escaneo de QR, validación manual, invalidaciones e historial. |
| `Reportes` | Eventos más vendidos, mayores compradores, ocupación, validaciones y auditoría. |
| `Home` | Datos resumidos para las pantallas de inicio por rol. |

---

## Seguridad y roles

La API utiliza autenticación mediante JWT.

Los roles principales son:

- `General`
- `Funcionario`
- `Admin`

Además de los roles de aplicación, el backend utiliza distintas conexiones a PostgreSQL según el usuario autenticado:

| Rol de aplicación | Rol de conexión PostgreSQL |
|---|---|
| Sin sesión | `obligatorio_unlogged` |
| General | `obligatorio_general` |
| Funcionario | `obligatorio_funcionario` |
| Admin | `obligatorio_admin` |
| Fallback interno | `obligatorio_app` |

La clase `RoleBasedNpgsqlConnectionFactory` selecciona la conexión adecuada según los claims del JWT.

---

## Endpoints principales

| Módulo | Ruta base |
|---|---|
| Auth | `/api/auth` |
| Home | `/api/home` |
| Usuarios | `/api/usuarios` |
| Infraestructura | `/api/infraestructura` |
| Eventos | `/api/eventos` |
| Compras | `/api/compras` |
| Entradas | `/api/entradas` |
| Transferencias | `/api/transferencias` |
| Validaciones | `/api/validaciones` |
| Reportes | `/api/reportes` |

La lista completa de endpoints se puede consultar en Swagger:

```text
http://localhost:5293/swagger
```

---

## CORS

El backend habilita CORS para el frontend web en desarrollo:

```text
http://localhost:5714
https://localhost:5714
http://localhost:5715
https://localhost:5715
```

En Docker, el frontend web accede al backend mediante el proxy de Vite.

---

## QR dinámico

La generación de QR está implementada en `EntradaQrCodeService`, usando `QRCoder`.

El payload del QR incluye:

- ID de entrada
- Email del propietario
- Timestamp
- Nonce aleatorio

El frontend solicita la regeneración del QR mediante el endpoint correspondiente y lo muestra al usuario en la vista de entrada.

---

## Base de datos

La base de datos se inicializa desde la raíz del proyecto con los scripts ubicados en:

```text
db/init
```

Los scripts principales son:

| Archivo | Función |
|---|---|
| `01_init_schema.sql` | Creación de tipos, tablas, constraints, índices, funciones y triggers. |
| `02_seed_data.sql` | Carga de datos iniciales y datos de prueba. |
| `03_roles_permissions.sql` | Creación de roles de conexión y permisos mínimos. |

Si se modifican estos scripts y Docker ya tenía un volumen creado, se debe reiniciar la base desde cero:

```bash
docker compose down -v
docker compose up --build
```

---
