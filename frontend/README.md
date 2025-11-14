This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
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

Las notificaciones ya estan integradas en las acciones de autenticacion (login, logout).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
