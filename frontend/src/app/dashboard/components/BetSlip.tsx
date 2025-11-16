"use client";

import React, { useState } from 'react';

type BetLine = {
  id: string;
  eventId: string;
  eventName: string;
  optionId: string;
  optionName: string;
  odd: number;
};

type Props = {
  open: boolean;
  line?: BetLine | null;
  onClose: () => void;
  onPlaceBet?: (line: BetLine, stake: number) => void;
};

export default function BetSlip({ open, line, onClose, onPlaceBet }: Props) {
  const [stake, setStake] = useState<number>(0);

  // Limpiar el stake cuando se cierra o cambia la línea
  React.useEffect(() => {
    if (!open) {
      setStake(0);
    }
  }, [open]);

  const potential = line ? Math.round(stake * (line.odd)) : 0;

  if (!line && !open) return null;

  const base = 'fixed right-4 bottom-4 w-96 bg-gradient-to-br from-neutral-medium to-neutral-medium/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-neutral-700 z-50 transform transition-all duration-300 ease-out';
  const openCls = 'translate-y-0 opacity-100 pointer-events-auto scale-100';
  const closedCls = 'translate-y-8 opacity-0 pointer-events-none scale-95';

  return (
    <aside aria-hidden={!open} className={`${base} ${open ? openCls : closedCls}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <h4 className="font-bold text-lg text-text-light">Tu Apuesta</h4>
        </div>
        <button 
          onClick={onClose} 
          className="text-text-light/60 hover:text-text-light transition-colors p-1"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {line ? (
        <>
          {/* Selección de apuesta */}
          <div className="bg-gradient-to-br from-neutral-dark/70 to-neutral-dark/50 rounded-xl p-4 mb-5 border border-neutral-700/50 hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="font-semibold text-text-light mb-1">{line.eventName}</div>
                <div className="text-sm text-text-light/70">{line.optionName}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-700/50">
              <span className="text-xs text-text-light/60">Cuota</span>
              <span className="text-xl font-bold text-primary">{Number(line.odd).toFixed(2)}</span>
            </div>
          </div>

          {/* Input de monto */}
          <div className="mb-5">
            <label className="text-sm font-medium text-text-light/80 mb-2 block">
              Monto a apostar
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={stake === 0 ? '' : stake.toString()}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  const num = cleaned === '' ? 0 : Number(cleaned);
                  setStake(num);
                }}
                placeholder="0"
                className="w-full px-4 py-3 rounded-lg bg-neutral-dark/60 text-text-light border-2 border-neutral-700 focus:border-primary focus:outline-none transition-colors text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light/50 text-sm font-medium">
                COP
              </span>
            </div>
            
            {/* Quick stake buttons */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1000, 5000, 10000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setStake(amount)}
                  className="px-3 py-2 text-xs font-medium bg-neutral-dark/40 hover:bg-neutral-dark/70 text-text-light rounded-md transition-colors border border-neutral-700/50 hover:border-primary/50"
                >
                  {amount >= 1000 ? `${amount / 1000}k` : amount}
                </button>
              ))}
            </div>
          </div>

          {/* Ganancia potencial */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 mb-5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-light/80 font-medium">Ganancia Potencial</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {potential.toLocaleString()}
                </div>
                <div className="text-xs text-text-light/60">COP</div>
              </div>
            </div>
          </div>

          {/* Botón de apuesta */}
          <button
            onClick={() => onPlaceBet && line && onPlaceBet(line, stake)}
            disabled={stake <= 0}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {stake <= 0 ? 'INGRESA UN MONTO' : 'CONFIRMAR APUESTA'}
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-dark/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-text-light/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-text-light/60">
            Selecciona una opción de los eventos disponibles para comenzar
          </p>
        </div>
      )}
    </aside>
  );
}
