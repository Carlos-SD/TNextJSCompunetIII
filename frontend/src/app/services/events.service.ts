import apiService from './api.service';
import { Event, CreateEventDto, CloseEventDto } from '../interfaces/event.interface';

export const eventsService = {
  async getAllEvents(): Promise<Event[]> {
    const response = await apiService.get<Event[]>('/events');
    return response.data;
  },

  async getOpen() {
    return apiService.get('/events/open');
  },

  async getOpenEvents(): Promise<Event[]> {
    const response = await apiService.get<Event[]>('/events/open');
    return response.data;
  },

  async getEventById(id: string): Promise<Event> {
    const response = await apiService.get<Event>(`/events/${id}`);
    return response.data;
  },

  async createEvent(data: CreateEventDto): Promise<Event> {
    const response = await apiService.post<Event>('/events', data);
    return response.data;
  },

  async closeEvent(id: string, data: CloseEventDto): Promise<Event> {
    const response = await apiService.patch<Event>(`/events/${id}/close`, data);
    return response.data;
  },
};

export default eventsService;
