import { renderHook, act } from '@testing-library/react';
import { useBetsStore } from '../bets.store';
import betsService from '../../services/bets.service';
import { toast } from '../toast.store';

jest.mock('../../services/bets.service');
jest.mock('../toast.store', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('betsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = renderHook(() => useBetsStore());
    act(() => {
      result.current.bets = [];
      result.current.isLoading = false;
      result.current.error = null;
    });
  });

  describe('fetchUserBets', () => {
    it('should fetch user bets successfully with userId', async () => {
      const userId = 'user-123';
      const mockBets = [
        {
          id: '1',
          eventId: 'event-1',
          eventName: 'Event 1',
          selectedOption: 'Team A',
          amount: 1000,
          potentialWinnings: 1500,
          status: 'pending',
          createdAt: new Date(),
        },
        {
          id: '2',
          eventId: 'event-2',
          eventName: 'Event 2',
          selectedOption: 'Team B',
          amount: 500,
          potentialWinnings: 1000,
          status: 'won',
          createdAt: new Date(),
        },
      ];

      (betsService.getUserBets as jest.Mock).mockResolvedValue(mockBets);

      const { result } = renderHook(() => useBetsStore());

      await act(async () => {
        await result.current.fetchUserBets(userId);
      });

      expect(betsService.getUserBets).toHaveBeenCalledWith(userId);
      expect(result.current.bets).toEqual(mockBets);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle missing userId', async () => {
      const { result } = renderHook(() => useBetsStore());

      await act(async () => {
        await result.current.fetchUserBets();
      });

      expect(result.current.error).toBe('Usuario no autenticado');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
      const userId = 'user-123';
      const errorMessage = 'Failed to fetch bets';
      (betsService.getUserBets as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBetsStore());

      await act(async () => {
        await result.current.fetchUserBets(userId);
      });

      expect(result.current.bets).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('createBet', () => {
    it('should create bet successfully', async () => {
      const betData = {
        eventId: 'event-1',
        selectedOption: 'Team A',
        amount: 1000,
      };

      const mockBet = {
        id: 'bet-1',
        ...betData,
        eventName: 'Event 1',
        potentialWinnings: 1500,
        status: 'pending',
        createdAt: new Date(),
      };

      (betsService.createBet as jest.Mock).mockResolvedValue(mockBet);

      const { result } = renderHook(() => useBetsStore());

      let createdBet;
      await act(async () => {
        createdBet = await result.current.createBet(betData);
      });

      expect(createdBet).toEqual(mockBet);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle create bet error', async () => {
      const betData = {
        eventId: 'event-1',
        selectedOption: 'Team A',
        amount: 1000,
      };
      const errorMessage = 'Insufficient balance';

      (betsService.createBet as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBetsStore());

      try {
        await act(async () => {
          await result.current.createBet(betData);
        });
      } catch (error) {
        // Expected to throw
      }

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useBetsStore());

      act(() => {
        result.current.error = 'Some error';
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('setCurrentBet', () => {
    it('should set current bet', () => {
      const mockBet = {
        id: 'bet-1',
        eventId: 'event-1',
        eventName: 'Event 1',
        selectedOption: 'Team A',
        amount: 1000,
        potentialWinnings: 1500,
        status: 'pending',
        createdAt: new Date(),
      };

      const { result } = renderHook(() => useBetsStore());

      act(() => {
        result.current.setCurrentBet(mockBet);
      });

      expect(result.current.currentBet).toEqual(mockBet);
    });
  });
});

