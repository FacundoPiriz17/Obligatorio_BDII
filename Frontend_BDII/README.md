# Frontend_BDII

Frontend web del sistema de ticketing del **Mundial 2026** para el obligatorio de **Bases de Datos II**.

Permite registrar usuarios, iniciar sesión, consultar partidos, comprar entradas, visualizar el wallet con QR dinámico, transferir entradas, validar accesos y administrar eventos, estadios, usuarios, dispositivos y reportes según el rol autenticado.

Construido con **React 19 + Vite 8 + Tailwind CSS v4**.

---

## Stack

| Área | Librería |
|---|---|
| UI | React 19 |
| Router | react-router-dom 7 |
| Build tool | Vite 8 |
| Estilos | Tailwind CSS v4 + `@tailwindcss/vite` |
| Utilidades CSS | `clsx` + `tailwind-merge` |
| Animación | framer-motion |
| Notificaciones | react-toastify |
| Gráficos | recharts |
| QR | `qrcode.react` para mostrar QR + `html5-qrcode` para escanear |
| Fechas | date-fns |
| Íconos | react-icons |
| Linting | ESLint |

---

## Variables de entorno

El proyecto incluye un archivo:

```text
.env.example
```

Variables disponibles:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_PROXY_TARGET` | URL del backend usada por el proxy de Vite en desarrollo. | `http://localhost:5293` |
| `VITE_API_URL` | URL absoluta de la API. Si queda vacía, se usa el proxy `/api`. | vacío |

En Docker, `docker-compose.yaml`  se configuró:

```text
VITE_PROXY_TARGET=http://backend:5293
```

En desarrollo local, se puede usar:

```text
VITE_PROXY_TARGET=http://localhost:5293
VITE_API_URL=
```

Cuando `VITE_API_URL` está vacío, las llamadas a `/api/*` pasan por el proxy configurado en `vite.config.js`.

---

## Puertos

| Servicio | Puerto |
|---|---|
| Frontend web | `5714` |
| Backend | `5293` |
| PostgreSQL | `5433` |

---

## Estructura del proyecto

```text
Frontend_BDII/
├── Dockerfile.dev
├── package.json
├── vite.config.js
├── eslint.config.js
├── public/
└── src/
    ├── app/
    ├── components/
    │   ├── feedback/
    │   ├── layout/
    │   └── ui/
    ├── features/
    │   ├── auth/
    │   ├── compras/
    │   ├── dashboard/
    │   ├── dispositivos/
    │   ├── entradas/
    │   ├── equipos/
    │   ├── estadios/
    │   ├── home/
    │   ├── notificaciones/
    │   ├── partidos/
    │   ├── transferencias/
    │   ├── usuarios/
    │   └── validaciones/
    ├── hooks/
    ├── lib/
    ├── routes/
    ├── services/
    └── styles/
```

---

## Arquitectura

El frontend está organizado con una arquitectura **feature-based**.

Cada dominio funcional tiene su propia carpeta dentro de `src/features`, separando páginas, componentes y servicios cuando corresponde.

Ejemplos:

| Feature | Responsabilidad |
|---|---|
| `auth` | Login, registro, sesión, refresh de token y guardas de autenticación. |
| `home` | Pantallas de inicio según rol. |
| `partidos` | Cartelera, detalle de partido y ABM de eventos para admin. |
| `equipos` | Listado y detalle de equipos. |
| `compras` | Flujo de compra e historial. |
| `entradas` | Wallet de entradas, QR dinámico y custodia. |
| `transferencias` | Bandeja de transferencias, creación y acciones sobre transferencias. |
| `validaciones` | Scanner web, verificación manual e historial. |
| `estadios` | ABM de estadios y modificación de sectores. |
| `usuarios` | Perfil propio y gestión de usuarios por admin. |
| `dispositivos` | Gestión de dispositivos de escaneo. |
| `dashboard` | reportes y auditoría administrativa. |
| `notificaciones` | Componentes y servicios de notificación en la interfaz. |

---

## Rutas principales

### Rutas públicas

| Ruta | Pantalla |
|---|---|
| `/login` | Inicio de sesión |
| `/registro` | Registro |
| `/no-autorizado` | Acceso denegado |
| `/sesion-expirada` | Sesión expirada o próxima a expirar |

### Usuario general

| Ruta | Pantalla |
|---|---|
| `/` | Inicio |
| `/partidos` | Listado de partidos |
| `/partidos/:idPartido` | Detalle de partido |
| `/equipos` | Listado de equipos |
| `/equipos/:codigoFifa` | Detalle de equipo |
| `/comprar/:idPartido` | Compra de entradas |
| `/mis-compras` | Historial de compras |
| `/mis-entradas` | Wallet de entradas |
| `/entradas/:idEntrada` | Detalle de entrada |
| `/transferencias` | Transferencias enviadas y recibidas |
| `/transferencias/nueva` | Crear transferencia |
| `/perfil` | Perfil propio |

### Funcionario

| Ruta | Pantalla |
|---|---|
| `/scanner` | Escaneo de QR |
| `/validaciones` | Historial de validaciones |
| `/perfil` | Perfil propio |

### Administrador

| Ruta | Pantalla |
|---|---|
| `/admin` | Dashboard |
| `/admin/eventos` | Gestión de eventos |
| `/admin/eventos/nuevo` | Alta de evento |
| `/admin/eventos/:idPartido/editar` | Edición de evento |
| `/admin/estadios` | Gestión de estadios |
| `/admin/estadios/nuevo` | Alta de estadio |
| `/admin/estadios/:idEstadio/editar` | Edición de estadio |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/dispositivos` | Gestión de dispositivos |
| `/admin/validaciones` | Historial de validaciones |
| `/admin/auditoria` | Auditoría |

---

## Roles y navegación

El frontend reconoce los siguientes roles:

- `General`
- `Funcionario`
- `Admin`

La navegación cambia según el rol del usuario autenticado:

| Rol | Navegación |
|---|---|
| General | Navbar principal y flujo de compra, entradas, transferencias y perfil. |
| Funcionario | Panel con sidebar para scanner, validaciones y perfil. |
| Admin | Panel con sidebar para dashboard, eventos, estadios, usuarios, dispositivos, validaciones y auditoría. |

Las rutas protegidas se controlan con:

- `ProtectedRoute`
- `RoleRoute`

`RoleRoute` permite el acceso si el usuario tiene al menos uno de los roles requeridos por la ruta.

---

## Sesión y autenticación

La sesión se maneja con JWT.

El token se guarda en `localStorage` usando un prefijo propio:

```text
ucu-mundial:
```

Cuando el backend responde `401`, el frontend limpia la sesión y redirige a:

```text
/sesion-expirada
```

También existe una advertencia de expiración: si faltan 5 minutos para que venza el JWT, se redirige al usuario a la pantalla de renovación de sesión.

---

## API client

El cliente HTTP se encuentra en:

```text
src/services/apiClient.js
```

El mapa centralizado de endpoints está en:

```text
src/services/endpoints.js
```

Si cambia una ruta del backend, se recomienda actualizar primero `endpoints.js`.

---

## Diseño visual

Los estilos principales se encuentran en:

```text
src/styles/index.css
```

El sistema visual define colores y tokens alineados a la identidad UCU/Mundial:

- Azul institucional
- Celeste Brillante
- Verde, ámbar y rojo para estados
- Sombras y estilos reutilizables
- Utilidades para scanner y QR

---
