'use client';

import { useState, useEffect } from 'react';
import { Event, CreateEventDto, UpdateEventDto, EventOption } from '@/app/interfaces/event.interface';

interface EventFormModalProps {
  event?: Event;
  onClose: () => void;
  onSubmit: (data: CreateEventDto | UpdateEventDto) => Promise<void>;
  title: string;
}

export default function EventFormModal({ event, onClose, onSubmit, title }: EventFormModalProps) {
  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [options, setOptions] = useState<EventOption[]>(
    event?.options || [
      { name: '', odds: 1.5 },
      { name: '', odds: 2.0 },
    ]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre del evento es requerido';
    }

    if (options.length < 2) {
      newErrors.options = 'Debe haber al menos 2 opciones';
    }

    options.forEach((option, index) => {
      if (!option.name.trim()) {
        newErrors[`option_${index}_name`] = 'El nombre de la opción es requerido';
      }
      if (option.odds <= 1) {
        newErrors[`option_${index}_odds`] = 'La cuota debe ser mayor a 1';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data: CreateEventDto | UpdateEventDto = {
        name: name.trim(),
        description: description.trim() || undefined,
        options: options
          .filter(opt => opt.name.trim())
          .map(opt => ({
            name: opt.name.trim(),
            // Solo enviar cuotas al crear evento (no al editar)
            ...(event ? {} : { odds: opt.odds }),
          })),
      };

      await onSubmit(data);
    } catch (error) {
      // El error se maneja en el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    setOptions([...options, { name: '', odds: 2.0 }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: keyof EventOption, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-neutral-medium to-neutral-medium/90 rounded-2xl border border-neutral-700 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-neutral-medium border-b border-neutral-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-light">{title}</h2>
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
          
          {/* Nombre del evento */}
          <div>
            <label className="block text-text-light/80 text-sm font-medium mb-2">
              Nombre del Evento *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-neutral-dark/60 text-text-light border-2 ${
                errors.name ? 'border-error' : 'border-neutral-700'
              } focus:border-primary focus:outline-none transition-colors`}
              placeholder="Ej: Fórmula 1 - Gran Premio"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-text-light/80 text-sm font-medium mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-neutral-dark/60 text-text-light border-2 border-neutral-700 focus:border-primary focus:outline-none transition-colors"
              placeholder="Descripción adicional del evento..."
            />
          </div>

          {/* Opciones de apuesta */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-text-light/80 text-sm font-medium">
                Opciones de Apuesta *
                {event && <span className="text-text-light/50 text-xs ml-2">(Solo se puede editar el nombre)</span>}
              </label>
              {!event && (
                <button
                  type="button"
                  onClick={addOption}
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Agregar Opción
                </button>
              )}
            </div>

            {errors.options && (
              <p className="text-error text-sm mb-3">{errors.options}</p>
            )}

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="bg-neutral-dark/40 rounded-lg p-4 border border-neutral-700/50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Nombre de la opción */}
                      <div>
                        <label className="block text-text-light/70 text-xs mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg bg-neutral-dark/60 text-text-light border ${
                            errors[`option_${index}_name`] ? 'border-error' : 'border-neutral-700'
                          } focus:border-primary focus:outline-none transition-colors text-sm`}
                          placeholder="Ej: Hamilton"
                        />
                        {errors[`option_${index}_name`] && (
                          <p className="text-error text-xs mt-1">{errors[`option_${index}_name`]}</p>
                        )}
                      </div>

                      {/* Cuota */}
                      <div>
                        <label className="block text-text-light/70 text-xs mb-1">
                          Cuota {event && <span className="text-text-light/50">(No editable)</span>}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.01"
                          value={option.odds}
                          onChange={(e) => updateOption(index, 'odds', parseFloat(e.target.value) || 0)}
                          disabled={!!event}
                          className={`w-full px-3 py-2 rounded-lg ${
                            event ? 'bg-neutral-dark/30 cursor-not-allowed opacity-60' : 'bg-neutral-dark/60'
                          } text-text-light border ${
                            errors[`option_${index}_odds`] ? 'border-error' : 'border-neutral-700'
                          } focus:border-primary focus:outline-none transition-colors text-sm`}
                          placeholder="2.5"
                        />
                        {errors[`option_${index}_odds`] && (
                          <p className="text-error text-xs mt-1">{errors[`option_${index}_odds`]}</p>
                        )}
                      </div>
                    </div>

                    {/* Botón eliminar (solo al crear) */}
                    {!event && options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-text-light/60 hover:text-error hover:bg-error/10 rounded-lg transition-colors flex-shrink-0 mt-5"
                        title="Eliminar opción"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-text-light/50 text-xs mt-2">
              Mínimo 2 opciones requeridas
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
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? 'Guardando...' : (event ? 'Actualizar Evento' : 'Crear Evento')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

