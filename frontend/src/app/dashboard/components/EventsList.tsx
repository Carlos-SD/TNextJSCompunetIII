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
};

type Props = {
  events: EventItem[];
  onSelectOption: (eventItem: EventItem, option: EventOption) => void;
};

export default function EventsList({ events = [], onSelectOption }: Props) {
  return (
    <div className="space-y-4">
      {events.map((ev) => (
        <div key={ev.id} className="bg-neutral-medium rounded-md p-4 text-text-light">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">{ev.name}</div>
            <div className="text-xs text-text-light/70">Estado: {ev.status ?? 'open'}</div>
          </div>

          <div className="flex gap-3">
            {ev.options?.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectOption(ev, opt)}
                className="bg-neutral-dark/60 text-text-light px-4 py-2 rounded-md hover:bg-gray-700/60 transition-colors"
              >
                <div className="text-sm font-medium">{opt.name}</div>
                <div className="text-xs text-text-light/90">@{opt.odd}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
