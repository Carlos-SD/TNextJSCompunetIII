import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventsStore } from '../events.store';
import { eventsService } from '../../services/events.service';
import { toast } from '../toast.store';

jest.mock('../../services/events.service');
jest.mock('../toast.store');

describe('eventsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvents = [
    {
      id: '1',
      name: 'Test Event 1',
      description: 'Description 1',
      status: 'open' as const,
      options: [
        { id: '1', name: 'Option 1', odds: 2.5 },
        { id: '2', name: 'Option 2', odds: 1.8 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Event 2',
      description: 'Description 2',
      status: 'closed' as const,
      finalResult: 'Winner',
      options: [
        { id: '3', name: 'Winner', odds: 2.0 },
        { id: '4', name: 'Loser', odds: 2.0 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe('fetchEvents', () => {
    it('should fetch all events successfully', async () => {
      (eventsService.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchEvents();
      });

      await waitFor(() => {
        expect(result.current.events).toEqual(mockEvents);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Failed to fetch events';
      (eventsService.getAllEvents as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchEvents();
      });

      await waitFor(() => {
        expect(result.current.events).toEqual([]);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('fetchOpenEvents', () => {
    it('should fetch only open events', async () => {
      const openEvents = mockEvents.filter(e => e.status === 'open');
      (eventsService.getOpenEvents as jest.Mock).mockResolvedValue(openEvents);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchOpenEvents();
      });

      await waitFor(() => {
        expect(result.current.events).toEqual(openEvents);
        expect(result.current.events).toHaveLength(1);
      });
    });

    it('should handle fetch open events error', async () => {
      const errorMessage = 'Failed to fetch open events';
      (eventsService.getOpenEvents as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchOpenEvents();
      });

      await waitFor(() => {
        expect(result.current.events).toEqual([]);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle fetch open events without error message', async () => {
      (eventsService.getOpenEvents as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchOpenEvents();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al cargar eventos abiertos');
      });
    });
  });

  describe('createEvent', () => {
    it('should create event and update store', async () => {
      const newEvent = {
        name: 'New Event',
        description: 'New Description',
        options: [
          { name: 'Option A', odds: 2.0 },
          { name: 'Option B', odds: 2.5 },
        ],
      };

      const createdEvent = {
        id: '3',
        ...newEvent,
        status: 'open' as const,
        options: newEvent.options.map((opt, i) => ({ ...opt, id: String(i + 1) })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (eventsService.createEvent as jest.Mock).mockResolvedValue(createdEvent);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.createEvent(newEvent);
      });

      await waitFor(() => {
        expect(result.current.events).toContainEqual(createdEvent);
        expect(toast.success).toHaveBeenCalledWith('Evento creado correctamente');
      });
    });

    it('should handle create event error', async () => {
      const errorMessage = 'Failed to create event';
      const newEvent = {
        name: 'New Event',
        description: 'Description',
        options: [],
      };

      (eventsService.createEvent as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.createEvent(newEvent);
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle create event without error message', async () => {
      const newEvent = {
        name: 'New Event',
        description: 'Description',
        options: [],
      };

      (eventsService.createEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.createEvent(newEvent);
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al crear evento');
      });
    });
  });

  describe('updateEvent', () => {
    it('should update event in store', async () => {
      const updatedEvent = {
        ...mockEvents[0],
        name: 'Updated Event Name',
      };

      (eventsService.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);

      const { result } = renderHook(() => useEventsStore());

      // Set initial events
      await act(async () => {
        (eventsService.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
        await result.current.fetchEvents();
      });

      // Update event
      await act(async () => {
        await result.current.updateEvent('1', { name: 'Updated Event Name' });
      });

      await waitFor(() => {
        const event = result.current.events.find(e => e.id === '1');
        expect(event?.name).toBe('Updated Event Name');
        expect(toast.success).toHaveBeenCalledWith('Evento actualizado correctamente');
      });
    });

    it('should handle update event error', async () => {
      const errorMessage = 'Failed to update event';

      (eventsService.updateEvent as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.updateEvent('1', { name: 'Updated' });
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle update event without error message', async () => {
      (eventsService.updateEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.updateEvent('1', { name: 'Updated' });
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al actualizar evento');
      });
    });
  });

  describe('closeEvent', () => {
    it('should close event and update status', async () => {
      (eventsService.closeEvent as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useEventsStore());

      // Set initial events
      await act(async () => {
        (eventsService.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
        await result.current.fetchEvents();
      });

      // Close event
      await act(async () => {
        await result.current.closeEvent('1', { finalResult: 'Option 1' });
      });

      await waitFor(() => {
        const event = result.current.events.find(e => e.id === '1');
        expect(event?.status).toBe('closed');
        expect(event?.finalResult).toBe('Option 1');
        expect(toast.success).toHaveBeenCalledWith('Evento cerrado correctamente');
      });
    });

    it('should handle close event error', async () => {
      const errorMessage = 'Event already closed';

      (eventsService.closeEvent as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.closeEvent('1', { finalResult: 'Winner' });
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle close event without error message', async () => {
      (eventsService.closeEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.closeEvent('1', { finalResult: 'Winner' });
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al cerrar evento');
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete event from store', async () => {
      (eventsService.deleteEvent as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useEventsStore());

      // Set initial events
      await act(async () => {
        (eventsService.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);
        await result.current.fetchEvents();
      });

      expect(result.current.events).toHaveLength(2);

      // Delete event
      await act(async () => {
        await result.current.deleteEvent('1');
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(1);
        expect(result.current.events.find(e => e.id === '1')).toBeUndefined();
        expect(toast.success).toHaveBeenCalledWith('Evento eliminado correctamente');
      });
    });

    it('should handle delete event error', async () => {
      const errorMessage = 'Cannot delete event with bets';

      (eventsService.deleteEvent as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.deleteEvent('1');
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle delete event without error message', async () => {
      (eventsService.deleteEvent as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.deleteEvent('1');
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al eliminar evento');
      });
    });
  });

  describe('fetchEventById', () => {
    it('should fetch event by id successfully', async () => {
      const mockEvent = mockEvents[0];
      (eventsService.getEventById as jest.Mock).mockResolvedValue(mockEvent);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchEventById('1');
      });

      await waitFor(() => {
        expect(result.current.currentEvent).toEqual(mockEvent);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle fetch event by id error', async () => {
      const errorMessage = 'Event not found';
      (eventsService.getEventById as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchEventById('999');
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle fetch event by id without error message', async () => {
      (eventsService.getEventById as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.fetchEventById('1');
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error al cargar evento');
      });
    });
  });

  describe('setCurrentEvent', () => {
    it('should set current event', () => {
      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.setCurrentEvent(mockEvents[0]);
      });

      expect(result.current.currentEvent).toEqual(mockEvents[0]);
    });

    it('should clear current event', () => {
      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.setCurrentEvent(mockEvents[0]);
      });

      expect(result.current.currentEvent).toEqual(mockEvents[0]);

      act(() => {
        result.current.setCurrentEvent(null);
      });

      expect(result.current.currentEvent).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      (eventsService.getAllEvents as jest.Mock).mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      const { result } = renderHook(() => useEventsStore());

      // Generate error
      await act(async () => {
        await result.current.fetchEvents();
      });

      expect(result.current.error).toBe('Error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});

