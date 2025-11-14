import { create } from 'zustand';
import { Event, CreateEventDto, CloseEventDto } from '../interfaces/event.interface';
import { eventsService } from '../services/events.service';

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEvents: () => Promise<void>;
  fetchOpenEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  createEvent: (data: CreateEventDto) => Promise<void>;
  closeEvent: (id: string, data: CloseEventDto) => Promise<void>;
  clearError: () => void;
  setCurrentEvent: (event: Event | null) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await eventsService.getAllEvents();
      set({ events, isLoading: false });
    } catch (error: any) {
      set({
        events: [],
        error: error.response?.data?.message || 'Error al cargar eventos',
        isLoading: false,
      });
    }
  },

  fetchOpenEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const events = await eventsService.getOpenEvents();
      set({ events, isLoading: false });
    } catch (error: any) {
      set({
        events: [],
        error: error.response?.data?.message || 'Error al cargar eventos abiertos',
        isLoading: false,
      });
    }
  },

  fetchEventById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventsService.getEventById(id);
      set({ currentEvent: event, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar evento',
        isLoading: false,
      });
    }
  },

  createEvent: async (data: CreateEventDto) => {
    set({ isLoading: true, error: null });
    try {
      await eventsService.createEvent(data);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear evento',
        isLoading: false,
      });
      throw error;
    }
  },

  closeEvent: async (id: string, data: CloseEventDto) => {
    set({ isLoading: true, error: null });
    try {
      await eventsService.closeEvent(id, data);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cerrar evento',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentEvent: (event: Event | null) => {
    set({ currentEvent: event });
  },
}));

