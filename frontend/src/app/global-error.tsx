'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-dark flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Ilustración de error crítico */}
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
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje */}
          <h1 className="text-4xl font-bold text-text-light mb-4">
            Error Crítico
          </h1>
          <p className="text-text-light/70 text-lg mb-8">
            Ha ocurrido un error crítico en la aplicación. Por favor, recarga la página.
          </p>

          {/* Botón de acción */}
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary hover:bg-[#1ed760] text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary/20"
          >
            Recargar aplicación
          </button>
        </div>
      </body>
    </html>
  );
}

