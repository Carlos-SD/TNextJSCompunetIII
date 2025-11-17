import eventsService from '../events.service';
import apiService from '../api.service';

jest.mock('../api.service');

describe('eventsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOpenEvents', () => {
    it('should fetch open events', async () => {
      const mockEvents = [
        { id: '1', name: 'Event 1', status: 'open' },
        { id: '2', name: 'Event 2', status: 'open' },
      ];

      (apiService.get as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventsService.getOpenEvents();

      expect(apiService.get).toHaveBeenCalledWith('/events/open');
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getAllEvents', () => {
    it('should fetch all events', async () => {
      const mockEvents = [
        { id: '1', name: 'Event 1', status: 'open' },
        { id: '2', name: 'Event 2', status: 'closed' },
      ];

      (apiService.get as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventsService.getAllEvents();

      expect(apiService.get).toHaveBeenCalledWith('/events');
      expect(result).toEqual(mockEvents);
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventData = {
        name: 'New Event',
        description: 'Description',
        options: [
          { name: 'Option 1', odds: 1.5 },
          { name: 'Option 2', odds: 2.0 },
        ],
      };
      const mockResponse = { id: '123', ...eventData, status: 'open' };

      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await eventsService.createEvent(eventData);

      expect(apiService.post).toHaveBeenCalledWith('/events', eventData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const eventId = '123';
      const updateData = {
        name: 'Updated Event',
        options: [{ name: 'Updated Option' }],
      };
      const mockResponse = { id: eventId, ...updateData };

      (apiService.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await eventsService.updateEvent(eventId, updateData);

      expect(apiService.patch).toHaveBeenCalledWith(`/events/${eventId}`, updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('closeEvent', () => {
    it('should close an event with final result', async () => {
      const eventId = '123';
      const closeData = { finalResult: 'Team A' };
      const mockResponse = { id: eventId, status: 'closed', finalResult: 'Team A' };

      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await eventsService.closeEvent(eventId, closeData);

      expect(apiService.post).toHaveBeenCalledWith(`/events/${eventId}/close`, closeData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getOpen', () => {
    it('should fetch open events using getOpen', async () => {
      const mockEvents = [
        { id: '1', name: 'Event 1', status: 'open' },
      ];

      (apiService.get as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventsService.getOpen();

      expect(apiService.get).toHaveBeenCalledWith('/events/open');
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEventById', () => {
    it('should fetch a single event by ID', async () => {
      const eventId = '123';
      const mockEvent = { id: eventId, name: 'Event 1', status: 'open' };

      (apiService.get as jest.Mock).mockResolvedValue(mockEvent);

      const result = await eventsService.getEventById(eventId);

      expect(apiService.get).toHaveBeenCalledWith(`/events/${eventId}`);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const eventId = '123';

      (apiService.delete as jest.Mock).mockResolvedValue(undefined);

      await eventsService.deleteEvent(eventId);

      expect(apiService.delete).toHaveBeenCalledWith(`/events/${eventId}`);
    });
  });
});

