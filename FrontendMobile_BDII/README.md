# FrontendMobile_BDII

Frontend mobile del sistema de ticketing del **Mundial 2026** para el obligatorio de **Bases de Datos II**.

La aplicación está desarrollada con **React Native + Expo** y permite acceder a funcionalidades móviles para usuarios generales, funcionarios y administradores.  
Incluye login, registro, compra de entradas, wallet con QR, transferencias, scanner de validación, registro de dispositivo del funcionario y auditoría básica para administradores.

---

## Stack

| Área | Librería / Tecnología |
|---|---|
| Framework mobile | React Native 0.85 |
| Plataforma | Expo SDK 56 |
| Navegación | Expo Router |
| UI | React Native Paper, componentes propios |
| Estilos | NativeWind + Tailwind CSS |
| Estado global | Zustand |
| Almacenamiento seguro | expo-secure-store |
| Identificación de dispositivo | expo-device + expo-crypto |
| Cámara / QR scanner | expo-camera |
| QR visual | react-native-qrcode-svg |
| Notificaciones | expo-notifications + react-native-toast-message |
| Fechas | dayjs |
| Íconos | @expo/vector-icons |
| Utilidades Expo | expo-file-system, expo-image-picker, expo-sharing, expo-print, entre otras |

---

## Configuración de variables de entorno

El proyecto incluye:

```text
.env.example
```

Se debe crear un archivo `.env`:

Variable principal:

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL base del backend consumida por la app mobile. |

Ejemplo para emulador Android:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:5293
```

Ejemplo para simulador iOS o web:

```text
EXPO_PUBLIC_API_URL=http://localhost:5293
```

Ejemplo para dispositivo físico con Expo Go:

```text
EXPO_PUBLIC_API_URL=http://IP_DE_LA_PC:5293
```

En un dispositivo físico no se debe usar `localhost`, porque `localhost` apunta al propio celular.  
Se debe usar la IP local de la computadora donde está corriendo Docker, por ejemplo:

```text
EXPO_PUBLIC_API_URL=http://192.168.0.12:5293
```

---

## Estructura del proyecto

```text
FrontendMobile_BDII/
├── app/
│   ├── (admin)/
│   ├── (auth)/
│   ├── (funcionario)/
│   ├── (general)/
│   ├── _layout.jsx
│   └── index.jsx
├── assets/
│   ├── flags/
│   ├── icons/
│   ├── images/
│   └── splash/
├── src/
│   ├── components/
│   │   ├── feedback/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── compras/
│   │   ├── dispositivo/
│   │   ├── entradas/
│   │   ├── partidos/
│   │   ├── reportes/
│   │   ├── transferencias/
│   │   ├── usuarios/
│   │   └── validaciones/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── services/
│   └── styles/
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
└── package.json
```

---

## Navegación

La app usa **Expo Router** con grupos de rutas por rol:

| Grupo | Descripción |
|---|---|
| `app/(auth)` | Login y registro. |
| `app/(general)` | Funcionalidades del usuario general. |
| `app/(funcionario)` | Funcionalidades del funcionario de validación. |
| `app/(admin)` | Funcionalidades móviles del administrador. |

El archivo:

```text
app/index.jsx
```

redirige al usuario según su sesión y rol.

---

## Pantallas principales

### Autenticación

| Ruta | Pantalla |
|---|---|
| `/(auth)/login` | Inicio de sesión |
| `/(auth)/register` | Registro |

### Usuario general

| Ruta | Pantalla |
|---|---|
| `/(general)/home` | Inicio |
| `/(general)/partidos` | Listado de partidos |
| `/(general)/partidos/[id]` | Detalle de partido |
| `/(general)/compras/nueva` | Nueva compra |
| `/(general)/compras/historial` | Historial de compras |
| `/(general)/entradas` | Entradas del usuario |
| `/(general)/entradas/[id]` | Detalle de entrada y QR |
| `/(general)/transferencias` | Transferencias |
| `/(general)/transferencias/nueva` | Nueva transferencia |
| `/(general)/perfil` | Perfil |

### Funcionario

| Ruta | Pantalla |
|---|---|
| `/(funcionario)/home` | Inicio del funcionario |
| `/(funcionario)/scanner` | Scanner de QR |
| `/(funcionario)/validaciones` | Historial de validaciones |
| `/(funcionario)/dispositivo` | Registro y consulta del dispositivo |
| `/(funcionario)/perfil` | Perfil |

### Administrador

| Ruta | Pantalla |
|---|---|
| `/(admin)/home` | Resumen administrativo |
| `/(admin)/auditoria` | Auditoría |
| `/(admin)/perfil` | Perfil |

---

## Sesión y almacenamiento

La sesión se maneja con JWT.

El token se guarda mediante:

```text
expo-secure-store
```

El estado global de autenticación se maneja con Zustand en:

```text
src/features/auth/store/useAuthStore.js
```

Si la API responde `401`, la app ejecuta logout automático.

---

## Dispositivo del funcionario

La app identifica el dispositivo mediante:

- `expo-device`
- `expo-crypto`
- `expo-secure-store`

El identificador local se genera y conserva como `installationId`.

Archivo relacionado:

```text
src/lib/deviceId.js
```

El funcionario puede registrar su dispositivo desde la pantalla:

```text
/(funcionario)/dispositivo
```

La app intenta asociar el dispositivo actual con los dispositivos registrados para el funcionario y prioriza el dispositivo que coincide con el `installationId` local.

---

## Scanner de QR

El scanner se implementa con:

```text
expo-camera
```

Archivo principal:

```text
src/features/validaciones/components/QRScanner.jsx
```

La app solicita permiso de cámara y escanea códigos QR usando la cámara trasera.  
Luego envía el código escaneado al backend mediante los endpoints de validación.

---

## API client

El cliente HTTP se encuentra en:

```text
src/services/apiClient.js
```

El mapa de endpoints se encuentra en:

```text
src/services/endpoints.js
```

La variable `EXPO_PUBLIC_API_URL` se usa como base para todas las llamadas.

---

## Estilos

La app usa NativeWind con Tailwind.

Archivos principales:

```text
tailwind.config.js
src/styles/global.css
```

El diseño replica los tokens visuales del frontend web:

- Azul institucional
- Celeste brillante
- Estados verde, amarillo y rojo
- Componentes reutilizables de UI

---

## Permisos

La app declara permiso de cámara en `app.json`.

Android:

```json
"permissions": ["CAMERA"]
```

iOS:

```json
"NSCameraUsageDescription": "Necesitamos la cámara para escanear códigos QR de las entradas."
```

---
