import { create } from 'zustand';
import { Bet, CreateBetDto } from '../interfaces/bet.interface';
import { betsService } from '../services/bets.service';
import { toast } from './toast.store';

interface BetsState {
  bets: Bet[];
  currentBet: Bet | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserBets: (userId?: string) => Promise<void>;
  createBet: (data: CreateBetDto) => Promise<Bet>;
  clearError: () => void;
  setCurrentBet: (bet: Bet | null) => void;
}

export const useBetsStore = create<BetsState>((set, get) => ({
  bets: [],
  currentBet: null,
  isLoading: false,
  error: null,

  fetchUserBets: async (userId: string) => {
    if (!userId) {
      set({ isLoading: false, error: 'Usuario no autenticado' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const bets = await betsService.getUserBets(userId);
      set({ bets, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar apuestas';
      set({
        bets: [],
        error: errorMessage,
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

