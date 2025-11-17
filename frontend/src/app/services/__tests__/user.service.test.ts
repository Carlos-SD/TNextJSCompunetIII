import userService from '../user.service';
import apiService from '../api.service';

jest.mock('../api.service');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('authToken', 'test-token');
  });

  describe('getProfile', () => {
    it('should fetch user profile and transform response', async () => {
      const mockResponse = {
        user: {
          id: '1',
          username: 'testuser',
          balance: 10000,
          roles: ['user'],
          isActive: true,
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await userService.getProfile();

      expect(apiService.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        balance: 10000,
        roles: ['user'],
        isActive: true,
        token: 'test-token',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Unauthorized');
      (apiService.get as jest.Mock).mockRejectedValue(error);

      await expect(userService.getProfile()).rejects.toThrow('Unauthorized');
    });

    it('should handle missing roles', async () => {
      const mockResponse = {
        user: {
          id: '1',
          username: 'testuser',
          balance: 10000,
          isActive: true,
        },
      };

      (apiService.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await userService.getProfile();

      expect(result.roles).toEqual([]);
    });
  });
});

