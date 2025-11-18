'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ilustración de error */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-danger/20 to-danger/10 rounded-full flex items-center justify-center border-4 border-danger/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16 text-danger"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        {/* Mensaje */}
        <h1 className="text-4xl font-bold text-text-light mb-4">
          ¡Oops! Algo salió mal
        </h1>
        <p className="text-text-light/70 text-lg mb-4">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>

        {/* Detalles del error (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-neutral-medium/50 rounded-lg border border-danger/30">
            <p className="text-danger text-sm font-mono text-left break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-text-light/50 text-xs mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary hover:bg-[#1ed760] text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary/20"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-neutral-medium hover:bg-neutral-medium/80 text-text-light rounded-lg font-semibold transition-all border border-neutral-700 hover:border-primary/50"
          >
            Ir al Dashboard
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-12 pt-8 border-t border-neutral-700">
          <p className="text-text-light/60 text-sm">
            Si el problema persiste, por favor contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}

