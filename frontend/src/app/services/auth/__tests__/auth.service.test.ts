import { authService } from '../auth.service';
import apiService from '../../api.service';

jest.mock('../../api.service');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login and store token', async () => {
      const credentials = { username: 'testuser', password: 'password123' };
      const mockResponse = {
        id: '1',
        username: 'testuser',
        token: 'test-token',
        roles: ['user'],
        balance: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(apiService.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('test-token');
    });
  });

  describe('register', () => {
    it('should register and store token', async () => {
      const data = {
        username: 'newuser',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const mockResponse = {
        id: '2',
        username: 'newuser',
        token: 'new-token',
        roles: ['user'],
        balance: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.register(data);

      expect(apiService.post).toHaveBeenCalledWith('/auth/register', data);
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('new-token');
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');

      authService.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');

      const token = authService.getToken();

      expect(token).toBe('test-token');
    });

    it('should return null if no token', () => {
      const token = authService.getToken();

      expect(token).toBeNull();
    });
  });
});

