import betsService from '../bets.service';
import apiService from '../api.service';

jest.mock('../api.service');

describe('betsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserBets', () => {
    it('should fetch user bets with cache-busting timestamp', async () => {
      const userId = 'user-123';
      const mockBets = [
        { id: '1', eventName: 'Event 1', amount: 100, status: 'pending' },
        { id: '2', eventName: 'Event 2', amount: 200, status: 'won' },
      ];

      (apiService.get as jest.Mock).mockResolvedValue(mockBets);

      const result = await betsService.getUserBets(userId);

      const callArgs = (apiService.get as jest.Mock).mock.calls[0][0];
      expect(callArgs).toContain(`/bets/user/${userId}`);
      expect(callArgs).toContain('_t=');
      expect(result).toEqual(mockBets);
    });

    it('should include timestamp in URL', async () => {
      const userId = 'user-123';
      const mockBets = [];
      (apiService.get as jest.Mock).mockResolvedValue(mockBets);

      await betsService.getUserBets(userId);

      const callUrl = (apiService.get as jest.Mock).mock.calls[0][0];
      expect(callUrl).toMatch(/\?_t=\d+/);
    });
  });

  describe('createBet', () => {
    it('should create a bet', async () => {
      const betData = {
        eventId: '123',
        selectedOption: 'Team A',
        amount: 500,
      };
      const mockResponse = {
        id: 'bet-1',
        ...betData,
        status: 'pending',
      };

      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await betsService.createBet(betData);

      expect(apiService.post).toHaveBeenCalledWith('/bets', betData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getBetById', () => {
    it('should fetch a bet by ID', async () => {
      const betId = 'bet-123';
      const mockBet = { id: betId, eventName: 'Event 1', amount: 100, status: 'pending' };

      (apiService.get as jest.Mock).mockResolvedValue(mockBet);

      const result = await betsService.getBetById(betId);

      expect(apiService.get).toHaveBeenCalledWith(`/bets/${betId}`);
      expect(result).toEqual(mockBet);
    });
  });
});

