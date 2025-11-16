import apiService from './api.service';
import { Event, CreateEventDto, CloseEventDto } from '../interfaces/event.interface';

export const eventsService = {
  async getAllEvents(): Promise<Event[]> {
    return await apiService.get<Event[]>('/events');
  },

  async getOpen() {
    return apiService.get('/events/open');
  },

  async getOpenEvents(): Promise<Event[]> {
    return await apiService.get<Event[]>('/events/open');
  },

  async getEventById(id: string): Promise<Event> {
    return await apiService.get<Event>(`/events/${id}`);
  },

  async createEvent(data: CreateEventDto): Promise<Event> {
    return await apiService.post<Event>('/events', data);
  },

  async closeEvent(id: string, data: CloseEventDto): Promise<Event> {
    return await apiService.patch<Event>(`/events/${id}/close`, data);
  },
};

export default eventsService;
