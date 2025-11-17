This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Gestion de Estado con Zustand

Este proyecto utiliza Zustand para la gestion de estado global. Se han implementado stores para:

- **Auth Store**: Manejo de autenticacion (login, logout, usuario actual)
- **Events Store**: Gestion de eventos deportivos
- **Bets Store**: Manejo de apuestas del usuario
- **Toast Store**: Sistema de notificaciones

Los stores se encuentran en `src/app/store/`.

## Funcionalidades Implementadas

### Sistema de Apuestas
- **Realizar Apuestas**: Los usuarios pueden apostar en eventos deportivos disponibles desde el dashboard
- **Historial de Apuestas**: Página completa para visualizar todas las apuestas realizadas (`/dashboard/my-bets`)
- **Estado de Apuestas**: Seguimiento de apuestas pendientes, ganadas y perdidas con badges de colores
- **Balance en Tiempo Real**: El saldo se actualiza automáticamente después de cada apuesta
- **Validaciones**: Verificación de saldo suficiente antes de apostar con mensajes de error claros

### Páginas Disponibles
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios
- `/dashboard` - Panel principal con eventos disponibles y sistema de apuestas
- `/dashboard/my-bets` - Historial completo de apuestas con resumen estadístico

### Endpoints del Backend Utilizados
- `POST /bets` - Crear nueva apuesta (requiere: userId, eventId, selectedOption, amount)
- `GET /bets/user/:userId` - Obtener todas las apuestas de un usuario
- `GET /auth/profile` - Obtener perfil del usuario autenticado
- `GET /events/open` - Obtener eventos disponibles para apostar

## Sistema de Notificaciones Toast

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

Las notificaciones ya estan integradas en las acciones de autenticacion (login, logout) y en el sistema de apuestas (apuesta exitosa, errores de saldo, etc.).

## Testing

El proyecto cuenta con pruebas automatizadas completas (cobertura objetivo: >80%):

### Tecnologías Utilizadas

**Pruebas Unitarias:**
- **Jest** - Framework de testing
- **React Testing Library** - Testing utilities para React
- **@testing-library/jest-dom** - Custom matchers
- **jest-environment-jsdom** - Entorno DOM para Jest

**Pruebas E2E:**
- **Playwright** - Framework para pruebas end-to-end
- **Chromium** - Navegador automatizado

### Características Importantes

**Tests Unitarios:**
- **100% Mockeados** - NO usan base de datos real
- **Rápidos** - Se ejecutan en milisegundos
- **Aislados** - No dependen de servicios externos
- **Reproducibles** - Siempre dan los mismos resultados

**Tests E2E:**
- **Base de datos real** con seed automático
- **Flujos completos** de usuario (login, apuestas, admin)
- **Navegador real** con interacciones reales

### Comandos Disponibles

```bash
# Tests unitarios (desarrollo)
bun test

# Tests unitarios con coverage
bun run test:coverage

# Tests E2E
bun run test:e2e

# Tests E2E con UI interactiva
bun run test:e2e:ui

# Todos los tests (CI)
bun run test:all

# Reiniciar BD con seed (antes de E2E)
bun run test:seed
```

### Requisitos por Comando

**Tests Unitarios (`test:coverage`):**
- Backend: NO necesario
- Frontend: NO necesario
- Base de datos: NO necesaria
- Son 100% mockeados, se ejecutan en memoria

**Tests E2E (`test:e2e`):**
- Backend: SÍ (debe estar corriendo en puerto 3000)
- Frontend: Auto-start (Playwright lo inicia automáticamente)
- Base de datos: SÍ (ejecutar `bun run test:seed` antes)

**Seed (`test:seed`):**
- Backend: SÍ (debe estar corriendo)
- Frontend: NO necesario

### Cobertura

Los tests unitarios están configurados para mantener un mínimo de 80% de cobertura en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (declaraciones)
