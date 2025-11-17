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

type UserBet = {
  id: string;
  eventId: string;
  selectedOption: string;
  status: string;
  amount: number;
};

type Props = {
  events: EventItem[];
  betEventIds: Set<string>;
  userBets: UserBet[];
  onSelectOption: (eventItem: EventItem, option: EventOption) => void;
};

export default function EventsList({ events = [], betEventIds, userBets, onSelectOption }: Props) {
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
      {events.map((ev) => {
        const hasActiveBet = betEventIds.has(ev.id);
        const userBet = userBets.find(bet => bet.eventId === ev.id && bet.status === 'pending');
        
        return (
          <div
            key={ev.id}
            className={`bg-gradient-to-br from-neutral-medium to-neutral-medium/80 rounded-xl p-6 border transition-all duration-300 ${
              hasActiveBet 
                ? 'border-warning/50 shadow-lg shadow-warning/10' 
                : 'border-neutral-700 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5'
            }`}
          >
            {/* Header del evento */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-text-light mb-1">{ev.name}</h3>
                {ev.description && (
                  <p className="text-text-light/60 text-sm">{ev.description}</p>
                )}
                {hasActiveBet && userBet && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-warning/20 border border-warning/30 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-warning">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className="text-warning text-xs font-semibold">
                      Ya apostaste ${userBet.amount} por "{userBet.selectedOption}"
                    </span>
                  </div>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                hasActiveBet 
                  ? 'bg-warning/20 text-warning border border-warning/30' 
                  : 'bg-success/20 text-success border border-success/30'
              }`}>
                {hasActiveBet ? 'YA APOSTADO' : 'ABIERTO'}
              </span>
            </div>

            {/* Opciones de apuesta */}
            <div className="space-y-2">
              <div className="text-text-light/70 text-sm font-medium mb-3">
                {hasActiveBet ? 'Opciones de este evento:' : 'Selecciona tu apuesta:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ev.options?.map((opt) => {
                  const isSelectedOption = userBet?.selectedOption === opt.name;
                  
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOption(ev, opt)}
                      disabled={hasActiveBet}
                      className={`group relative backdrop-blur-sm text-text-light px-5 py-4 rounded-lg border-2 transition-all duration-300 ${
                        hasActiveBet
                          ? isSelectedOption
                            ? 'bg-warning/10 border-warning/50 cursor-not-allowed'
                            : 'bg-neutral-dark/30 border-neutral-700/50 cursor-not-allowed opacity-50'
                          : 'bg-neutral-dark/60 border-neutral-700 hover:border-primary hover:bg-neutral-dark/80 hover:scale-105 hover:shadow-md hover:shadow-primary/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left flex-1">
                          <div className={`text-sm font-medium transition-colors ${
                            isSelectedOption 
                              ? 'text-warning' 
                              : hasActiveBet 
                                ? 'text-text-light/50' 
                                : 'text-text-light group-hover:text-primary'
                          }`}>
                            {opt.name}
                            {isSelectedOption && (
                              <span className="ml-2 text-xs">✓</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className={`text-xl font-bold ${
                            isSelectedOption 
                              ? 'text-warning' 
                              : hasActiveBet 
                                ? 'text-text-light/50' 
                                : 'text-primary'
                          }`}>
                            {Number(opt.odd).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Efecto de brillo al hover (solo si no ha apostado) */}
                      {!hasActiveBet && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer con info adicional */}
            <div className="mt-4 pt-4 border-t border-neutral-700/50 flex justify-between items-center text-xs text-text-light/50">
              <span>{ev.options?.length || 0} opciones disponibles</span>
              <span>{hasActiveBet ? 'No puedes apostar dos veces en un evento' : 'Haz click en una cuota para apostar'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
