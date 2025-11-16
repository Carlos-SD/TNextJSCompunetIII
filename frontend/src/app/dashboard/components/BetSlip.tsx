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

  const base = 'fixed right-4 bottom-4 w-80 bg-neutral-medium rounded-lg p-4 shadow-2xl z-50 transform transition-transform transition-opacity duration-300 ease-out';
  const openCls = 'translate-y-0 opacity-100 pointer-events-auto';
  const closedCls = 'translate-y-8 opacity-0 pointer-events-none';

  return (
    <aside aria-hidden={!open} className={`${base} ${open ? openCls : closedCls}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Apostá aquí</h4>
        <button onClick={onClose} className="text-sm">Cerrar</button>
      </div>

      {line ? (
        <>
          <div className="bg-neutral-dark/50 rounded p-3 mb-3">
            <div className="font-medium">{line.eventName}</div>
            <div className="text-sm text-text-light/80">{line.optionName} @ {line.odd}</div>
          </div>

          <label className="text-sm text-text-light/80">Monto apostado</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={stake.toString()}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              const num = cleaned === '' ? 0 : Number(cleaned);
              setStake(num);
            }}
            className="w-full mt-1 mb-3 px-3 py-2 rounded bg-neutral-dark/40 text-text-light"
          />

          <div className="text-sm text-text-light/80 mb-4">Ganancia potencial</div>
          <div className="font-bold text-lg mb-4">{potential.toLocaleString()} COP</div>

          <button
            onClick={() => onPlaceBet && line && onPlaceBet(line, stake)}
            className="w-full bg-[#1DB954] hover:bg-[#17a34a] text-white font-semibold py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]/30 active:scale-95 transition-transform"
          >
            APOSTAR AHORA
          </button>
        </>
      ) : (
        <div className="text-sm text-text-light/80">Selecciona una cuota para construir tu apuesta</div>
      )}
    </aside>
  );
}
