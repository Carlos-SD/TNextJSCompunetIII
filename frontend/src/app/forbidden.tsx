'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Forbidden() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ilustración 403 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-warning/20 mb-4">403</div>
        </div>

        {/* Mensaje */}
        <h1 className="text-4xl font-bold text-text-light mb-4">
          Acceso Denegado
        </h1>
        <p className="text-text-light/70 text-lg mb-8">
          No tienes permisos para acceder a esta sección.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-neutral-medium hover:bg-neutral-medium/80 text-text-light rounded-lg font-semibold transition-all border border-neutral-700 hover:border-primary/50"
          >
            ← Volver atrás
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-primary hover:bg-[#1ed760] text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary/20"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

