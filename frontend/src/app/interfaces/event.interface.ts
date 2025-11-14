export enum EventStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface EventOption {
  id: string;
  option: string;
  odds: number;
  eventId: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  status: EventStatus;
  finalResult: string | null;
  createdAt: string;
  updatedAt: string;
  options: EventOption[];
}

export interface CreateEventDto {
  name: string;
  description: string;
  options: {
    option: string;
    odds: number;
  }[];
}

export interface CloseEventDto {
  finalResult: string;
}

