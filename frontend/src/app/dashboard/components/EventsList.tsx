"use client";

import React from 'react';

type EventOption = {
  id: string;
  name: string;
  odd: number;
};

type EventItem = {
  id: string;
  name: string;
  status?: string;
  options?: EventOption[];
  description?: string;
};

type Props = {
  events: EventItem[];
  onSelectOption: (eventItem: EventItem, option: EventOption) => void;
};

export default function EventsList({ events = [], onSelectOption }: Props) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-light/50 text-lg mb-2">No hay eventos disponibles</div>
        <p className="text-text-light/40 text-sm">Vuelve más tarde para ver nuevos eventos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="bg-gradient-to-br from-neutral-medium to-neutral-medium/80 rounded-xl p-6 border border-neutral-700 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
        >
          {/* Header del evento */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-light mb-1">{ev.name}</h3>
              {ev.description && (
                <p className="text-text-light/60 text-sm">{ev.description}</p>
              )}
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/20 text-success border border-success/30">
              ABIERTO
            </span>
          </div>

          {/* Opciones de apuesta */}
          <div className="space-y-2">
            <div className="text-text-light/70 text-sm font-medium mb-3">
              Selecciona tu apuesta:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ev.options?.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectOption(ev, opt)}
                  className="group relative bg-neutral-dark/60 backdrop-blur-sm text-text-light px-5 py-4 rounded-lg border-2 border-neutral-700 hover:border-primary hover:bg-neutral-dark/80 transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary/20"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-text-light group-hover:text-primary transition-colors">
                        {opt.name}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-xl font-bold text-primary">
                        {Number(opt.odd).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer con info adicional */}
          <div className="mt-4 pt-4 border-t border-neutral-700/50 flex justify-between items-center text-xs text-text-light/50">
            <span>{ev.options?.length || 0} opciones disponibles</span>
            <span>Haz click en una cuota para apostar</span>
          </div>
        </div>
      ))}
    </div>
  );
}
