# Sports Bet System

Sistema de apuestas deportivas con autenticación JWT y autorización basada en roles.


## Integrantes 
- Juan Esteban Eraso
- Carlos Sanchez
- Alejandro Mejia
- Nicolas Cardona

## Instalación

```bash
bun install
```

## Base de Datos

### Usando PostgreSQL en la Nube (ej. Render, AWS, etc.)

El proyecto está configurado para soportar conexiones SSL a bases de datos en la nube.

**Nota:** Asegúrate de configurar correctamente las credenciales en el archivo `.env`

### Usando Docker (Local)

Si prefieres usar Docker localmente para desarrollo:

```bash
docker-compose up -d
```

Configura el `.env` para conexión local:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_local
DB_NAME=sports_bet_db
```

## Ejecutar la aplicación

```bash
# Desarrollo
bun run start:dev

# Producción
bun run build
bun run start:prod
```

## Ejecutar los tests

```bash
# unit tests 
bun run test:cov

# e2e tests
bun run test:e2e:cov
```

## Datos de Prueba (Seed)

El proyecto incluye un sistema de seed para poblar la base de datos con datos de prueba.

### Ejecutar el Seed

```bash
bun run seed
```

### Limpiar Datos

```bash
bun run seed:clear
```

**Nota:** El servidor debe estar corriendo antes de ejecutar los scripts de seed.

### Datos Incluidos

- **Usuarios:** admin, usuario1, usuario2, usuario3 (contraseña: `password123`)
- **Eventos:** 6 eventos deportivos con opciones
- **Apuestas:** 8 apuestas de ejemplo

## Autenticación y Autorización

### Roles Disponibles

1. **user** - Usuario regular que puede realizar apuestas
2. **admin** - Administrador con permisos completos para gestionar eventos

### Endpoints de Autenticación

#### Registrarse
```bash
POST /auth/register
{
  "username": "usuario1",
  "password": "password123",
  "roles": ["user"]  // opcional, por defecto ["user"]
}
```

#### Iniciar Sesión
```bash
POST /auth/login
{
  "username": "usuario1",
  "password": "password123"
}
```

Respuesta:
```json
{
  "id": "uuid",
  "username": "usuario1",
  "roles": ["user"],
  "balance": 10000,
  "isActive": true,
  "token": "eyJhbGc..."
}
```

#### Ver Perfil
```bash
GET /auth/profile
Authorization: Bearer {token}
```

### Uso de Tokens

Los tokens deben enviarse en el header:

```
Authorization: Bearer {tu_token}
```

## API Endpoints

### Usuarios

- `POST /users` - Crear usuario
- `GET /users` - Listar todos (admin)
- `GET /users/:id` - Ver perfil (autenticado)
- `GET /users/:id/balance` - Ver balance (autenticado)
- `PATCH /users/:id` - Actualizar (autenticado)
- `DELETE /users/:id` - Eliminar (admin)

### Eventos

- `POST /events` - Crear evento (admin)
- `GET /events` - Listar todos (autenticado)
- `GET /events/open` - Ver eventos abiertos (público)
- `GET /events/:id` - Ver detalles (público)
- `PATCH /events/:id` - Actualizar (admin)
- `POST /events/:id/close` - Cerrar evento (admin)
- `DELETE /events/:id` - Eliminar (admin)

### Apuestas

- `POST /bets` - Crear apuesta (autenticado)
- `GET /bets` - Listar todas (admin)
- `GET /bets/:id` - Ver apuesta (autenticado)
- `GET /bets/user/:userId` - Apuestas del usuario (autenticado)
- `GET /bets/user/:userId/stats` - Estadísticas (autenticado)
- `GET /bets/event/:eventId` - Apuestas de evento (autenticado)
- `POST /bets/event/:eventId/process` - Procesar apuestas (admin)
- `DELETE /bets/:id` - Eliminar apuesta (autenticado)

## Frontend

El frontend está desarrollado con Next.js 16 y se encuentra en la carpeta `/frontend`.

### Gestion de Estado con Zustand

El proyecto utiliza Zustand para la gestion de estado global. Se han implementado stores para:

- **Auth Store**: Manejo de autenticacion (login, logout, usuario actual)
- **Events Store**: Gestion de eventos deportivos
- **Bets Store**: Manejo de apuestas del usuario
- **Toast Store**: Sistema de notificaciones

Los stores se encuentran en `frontend/src/app/store/`.

### Sistema de Notificaciones Toast

El proyecto incluye un sistema de notificaciones tipo toast que reemplaza los `window.alert()` tradicionales. Las notificaciones aparecen en la esquina superior derecha y se cierran automaticamente.

Uso basico:

```typescript
import { toast } from '@/app/store/toast.store';

// Tipos de notificaciones
toast.success('Operacion exitosa');
toast.error('Ocurrio un error');
toast.info('Informacion importante');
toast.warning('Advertencia');
```

Las notificaciones ya estan integradas en las acciones de autenticacion (login, logout).

## Características

### ✅ Autenticación (5%)
- Sistema JWT (JSON Web Tokens)
- Login y registro de usuarios
- Tokens con expiración de 24 horas
- Validación de contraseñas encriptadas

### ✅ Autorización (5%)
- Dos roles: `user` y `admin`
- Guards de autenticación con Passport JWT (`AuthGuard()`)
- Guards de autorización basados en roles (`RolesGuard`)
- Decorador `@Auth()` composable para restringir acceso
- Decorador `@RoleProtected()` para protección granular
- Decorador `@GetUser()` para obtener el usuario autenticado
- Sistema de roles basado en enums (`ValidRoles`)
- Permisos diferenciados por rol
- Soporte para múltiples roles por usuario (ej: admin puede tener ['admin', 'user'])

## Notas

- Las contraseñas se encriptan con bcrypt (10 salt rounds)
- Los tokens JWT expiran después de 24 horas
- El rol por defecto es `['user']`
- Los usuarios pueden tener múltiples roles simultáneamente
- La contraseña no se incluye en las respuestas (select: false)
- Los nombres de usuario se normalizan automáticamente (lowercase + trim)
- Usa variables de entorno para configuración sensible (JWT_SECRET, etc.)
