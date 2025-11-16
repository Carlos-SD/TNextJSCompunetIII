export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
}

export interface Bet {
  id: string;
  selectedOption: string;
  odds: number;
  amount: number;
  status: BetStatus;
  profit: number;
  createdAt: string;
  userId: string;
  eventId: string;
  event?: {
    id: string;
    name: string;
    status: string;
  };
}

export interface CreateBetDto {
  userId: string;
  eventId: string;
  selectedOption: string;
  amount: number;
}

