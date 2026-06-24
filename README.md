# Obligatorio_BDII

Obligatorio de Bases de Datos 2 — Sistema de ticketing para partidos del Mundial 2026.

El proyecto incluye:

- Backend desarrollado en **.NET**.
- Frontend web desarrollado en **React + Vite**.
- Base de datos **PostgreSQL**.
- Dockerización mediante **Docker Compose**.
- Frontend mobile desarrollado con **React Native + Expo**.

---

## Requisitos previos

Para ejecutar la versión principal del sistema se necesita tener instalado:

- Docker Desktop
- Git, (opcional si se desea clonar el repositorio, el proyecto se podría descargar como zip sin problema)

No es necesario tener PostgreSQL, Node.js ni .NET instalados para correr la versión dockerizada del backend, frontend web y base de datos.

---

## Cómo obtener el proyecto

Una vez obtenido el link al repositorio de GitHub, existen dos opciones:

1. Clonar el repositorio.
2. Descargarlo como archivo ZIP.

Para una demo o corrección, descargar el ZIP puede ser la opción más simple, ya que evita traer configuración adicional de Git que no es necesaria si no se van a realizar cambios sobre el código.

Luego de descargar o clonar el proyecto, se debe abrir una terminal en la carpeta raíz del proyecto:

```bash
cd Obligatorio_BDII
```

---
## Datos de demo

La base de datos se inicializa con los scripts ubicados en:

```text
db/init
```

Estos scripts crean el esquema, cargan datos de prueba y configuran los roles/permisos utilizados por la aplicación.

Además, el proyecto incluye una carpeta auxiliar:

```text
db/Carga de entrada para demo
```

Esta carpeta contiene datos específicos para facilitar la demo de validación de entradas, especialmente una entrada activa asociada a un partido del día, pensada para probar el flujo de funcionario y validación.

No es necesario ejecutar manualmente esa carpeta para iniciar el sistema normal. Se deja separada como apoyo para la demo y para identificar claramente qué datos fueron agregados con ese propósito.

Para utilizar estos datos de demo, antes de iniciar la base de datos se debe copiar el contenido del archivo ubicado en `db/Carga de entrada para demo` dentro del archivo:

```text
db/init/02_seed_data.sql
```

El contenido debe pegarse justo debajo del comentario:

```sql
-- Insertar aquí los datos de ejemplo en /Carga de entrada para validar
```

También se debe recordar cambiar la hora del `INSERT` del partido de demo para que coincida con el horario en el que se realizará la prueba. Esto es importante porque la validación de entradas depende de la fecha y hora del partido, por lo que si el horario queda fuera del rango esperado, el flujo de validación puede fallar.

---

## Ejecución con Docker

Desde la carpeta raíz del proyecto, teniendo abierto el programa docker desktop, en la terminal ejecutar:

```bash
docker compose up --build
```

Este comando levanta automáticamente:

- PostgreSQL
- Backend
- Frontend web

## Acceso a la aplicación

Una vez levantados los contenedores, ingresar desde el navegador a:

```text
http://localhost:5714/
```

El backend queda disponible en:

```text
http://localhost:5293/
```

Swagger queda disponible en:

```text
http://localhost:5293/swagger
```

---

## Usuarios de prueba

Todos los usuarios de prueba tienen la misma contraseña:

```text
1234
```

Ejemplos de acceso por rol:

| Rol | Correo |
|---|---|
| Usuario general | `facundo.piriz@correo.ucu.edu.uy` |
| Usuario general | `agustin.garciab@correo.ucu.edu.uy` |
| Usuario general | `agostina.etchebarren@correo.ucu.edu.uy` |
| Administrador EEUU | `diego.deoliveira@correo.ucu.edu.uy` |
| Administrador México | `thiago.garcia@correo.ucu.edu.uy` |
| Administrador Canadá | `santiago.aguerre@correo.ucu.edu.uy` |
| Funcionario | `fabrizio.rodriguez@correo.ucu.edu.uy` |

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

## Frontend mobile

La aplicación mobile se encuentra en:

```text
FrontendMobile_BDII
```

El frontend mobile no se levanta desde el `docker-compose.yaml` principal. 
Para probarlo, primero se debe tener corriendo el backend con Docker y luego ejecutar la app mobile por separado.
Antes de correr la app mobile, revisar el archivo `.env.example` y crear un archivo `.env` con la URL correspondiente del backend.

Pasos básicos:

```bash
cd FrontendMobile_BDII
npm i
npx expo start
```

Ejemplo para emulador Android:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:5293
```

Ejemplo para dispositivo físico con Expo Go:

```text
EXPO_PUBLIC_API_URL=http://IP_DE_LA_PC:5293
```
---

## Repositorios originales

Frontend original:

```text
https://github.com/FacundoPiriz17/Frontend_BDII
```

Backend original:

```text
https://github.com/FacundoPiriz17/Backend_BDII
```

Frontend Mobile Original:
```text
https://github.com/FacundoPiriz17/FrontendMobile_BDII
```
