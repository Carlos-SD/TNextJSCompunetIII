'use client';

import { useState } from 'react';
import { Event, CloseEventDto } from '@/app/interfaces/event.interface';

interface CloseEventModalProps {
  event: Event;
  onClose: () => void;
  onSubmit: (data: CloseEventDto) => Promise<void>;
}

export default function CloseEventModal({ event, onClose, onSubmit }: CloseEventModalProps) {
  const [winningOption, setWinningOption] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!winningOption) {
      setError('Debes seleccionar la opción ganadora');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({ finalResult: winningOption });
    } catch (error) {
      // El error se maneja en el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-neutral-medium to-neutral-medium/90 rounded-2xl border border-neutral-700 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto my-8">
        
        {/* Header */}
        <div className="bg-neutral-medium border-b border-neutral-700 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-text-light">Cerrar Evento</h2>
            <p className="text-text-light/60 text-sm mt-1">Selecciona el resultado ganador</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-light/60 hover:text-text-light hover:bg-neutral-dark/40 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Información del evento */}
          <div className="bg-neutral-dark/40 rounded-lg p-4 border border-neutral-700/50">
            <h3 className="font-semibold text-text-light mb-2">{event.name}</h3>
            {event.description && (
              <p className="text-text-light/70 text-sm">{event.description}</p>
            )}
          </div>

          {/* Advertencia */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-warning flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-warning font-medium text-sm mb-1">Atención</p>
              <p className="text-warning/80 text-xs">
                Al cerrar este evento, se procesarán todas las apuestas asociadas. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Selección de ganador */}
          <div>
            <label className="block text-text-light/80 text-sm font-medium mb-3">
              Opción Ganadora *
            </label>
            <div className="space-y-2">
              {event.options?.map((option) => (
                <label
                  key={option.id || option.name}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    winningOption === option.name
                      ? 'border-success bg-success/10'
                      : 'border-neutral-700 bg-neutral-dark/40 hover:border-neutral-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="winningOption"
                    value={option.name}
                    checked={winningOption === option.name}
                    onChange={(e) => setWinningOption(e.target.value)}
                    className="w-5 h-5 text-success focus:ring-success focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text-light">{option.name}</div>
                    <div className="text-text-light/60 text-sm">Cuota: {Number(option.odds).toFixed(2)}</div>
                  </div>
                  {winningOption === option.name && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-success">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
            {error && (
              <p className="text-error text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <p className="text-info text-xs">
              Las apuestas ganadoras se acreditarán automáticamente y las perdedoras se marcarán como perdidas.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-dark/60 hover:bg-neutral-dark/80 text-text-light rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !winningOption}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-warning to-warning/90 hover:from-warning/90 hover:to-warning text-white font-semibold rounded-xl shadow-lg shadow-warning/20 hover:shadow-warning/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? 'Cerrando...' : 'Cerrar Evento'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

