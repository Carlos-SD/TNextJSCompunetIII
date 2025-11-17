export enum EventStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface EventOption {
  id?: string;
  name: string;
  option?: string;
  odds: number;
  eventId?: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  status: 'open' | 'closed' | EventStatus;
  finalResult?: string | null;
  winningOption?: string | null;
  createdAt: string;
  updatedAt: string;
  options?: EventOption[];
}

export interface CreateEventDto {
  name: string;
  description?: string;
  options: {
    name: string;
    odds: number;
  }[];
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  options?: {
    name: string;
    odds: number;
  }[];
}

export interface CloseEventDto {
  finalResult: string;
}

