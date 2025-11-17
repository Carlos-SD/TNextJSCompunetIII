import { create } from 'zustand';
import { Event, CreateEventDto, CloseEventDto, UpdateEventDto } from '../interfaces/event.interface';
import { eventsService } from '../services/events.service';
import { toast } from './toast.store';

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEvents: () => Promise<void>;
  fetchOpenEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  createEvent: (data: CreateEventDto) => Promise<Event>;
  updateEvent: (id: string, data: UpdateEventDto) => Promise<Event>;
  closeEvent: (id: string, data: CloseEventDto) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentEvent: (event: Event | null) => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
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
      const errorMessage = error.response?.data?.message || 'Error al cargar eventos';
      set({
        events: [],
        error: errorMessage,
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
      const newEvent = await eventsService.createEvent(data);
      
      // Agregar el nuevo evento a la lista local
      const currentEvents = get().events;
      set({ 
        events: [newEvent, ...currentEvents],
        isLoading: false 
      });
      
      toast.success('Evento creado correctamente');
      return newEvent;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear evento';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateEvent: async (id: string, data: UpdateEventDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedEvent = await eventsService.updateEvent(id, data);
      
      // Actualizar el evento en la lista local
      const currentEvents = get().events;
      const updatedEvents = currentEvents.map(event => 
        event.id === id ? updatedEvent : event
      );
      
      set({ 
        events: updatedEvents,
        isLoading: false 
      });
      
      toast.success('Evento actualizado correctamente');
      return updatedEvent;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar evento';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  closeEvent: async (id: string, data: CloseEventDto) => {
    set({ isLoading: true, error: null });
    try {
      await eventsService.closeEvent(id, data);
      
      // Actualizar el evento en la lista local (marcarlo como cerrado)
      const currentEvents = get().events;
      const updatedEvents = currentEvents.map(event => 
        event.id === id 
          ? { ...event, status: 'closed' as const, finalResult: data.finalResult }
          : event
      );
      
      set({ 
        events: updatedEvents,
        isLoading: false 
      });
      
      toast.success('Evento cerrado correctamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cerrar evento';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await eventsService.deleteEvent(id);
      
      // Eliminar el evento de la lista local
      const currentEvents = get().events;
      const filteredEvents = currentEvents.filter(event => event.id !== id);
      
      set({ 
        events: filteredEvents,
        isLoading: false 
      });
      
      toast.success('Evento eliminado correctamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar evento';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
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

