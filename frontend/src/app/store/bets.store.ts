import { create } from 'zustand';
import { Bet, CreateBetDto } from '../interfaces/bet.interface';
import { betsService } from '../services/bets.service';

interface BetsState {
  bets: Bet[];
  currentBet: Bet | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserBets: () => Promise<void>;
  createBet: (data: CreateBetDto) => Promise<Bet>;
  clearError: () => void;
  setCurrentBet: (bet: Bet | null) => void;
}

export const useBetsStore = create<BetsState>((set) => ({
  bets: [],
  currentBet: null,
  isLoading: false,
  error: null,

  fetchUserBets: async () => {
    set({ isLoading: true, error: null });
    try {
      const bets = await betsService.getUserBets();
      set({ bets, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al cargar apuestas',
        isLoading: false,
      });
    }
  },

  createBet: async (data: CreateBetDto) => {
    set({ isLoading: true, error: null });
    try {
      const bet = await betsService.createBet(data);
      set({ isLoading: false });
      return bet;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al crear apuesta',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setCurrentBet: (bet: Bet | null) => {
    set({ currentBet: bet });
  },
}));

