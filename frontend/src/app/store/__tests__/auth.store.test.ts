import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthStore } from '../auth.store';
import { authService } from '../../services/auth/auth.service';
import userService from '../../services/user.service';
import { toast } from '../toast.store';

// Mock services
jest.mock('../../services/auth/auth.service');
jest.mock('../../services/user.service');
jest.mock('../toast.store', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Clear store
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
    
    // Clear mocks
    jest.clearAllMocks();

    // Reset window.location.href
    window.location.href = '';
  });

  describe('login', () => {
    it('should login successfully', async () => {
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

      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({ username: 'testuser', password: 'password123' });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockResponse);
      expect(result.current.token).toBe('test-token');
      expect(toast.success).toHaveBeenCalledWith('¡Bienvenido! Has iniciado sesión correctamente');
    });

    it('should handle login error', async () => {
      const errorMessage = 'Credenciales inválidas';
      const mockError = {
        response: { data: { message: errorMessage } },
      };
      (authService.login as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuthStore());

      try {
        await act(async () => {
          await result.current.login({ username: 'wrong', password: 'wrong' });
        });
      } catch (error) {
        // Expected to throw
      }

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
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

      (authService.register as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.register({
          username: 'newuser',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.username).toBe('newuser');
      expect(toast.success).toHaveBeenCalledWith('¡Cuenta creada! Bienvenido a BetFicticia');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        token: 'test-token',
        roles: ['user'],
        balance: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (authService.login as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuthStore());

      // First login
      await act(async () => {
        await result.current.login({ username: 'testuser', password: 'password123' });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(toast.info).toHaveBeenCalledWith('Has cerrado sesión correctamente');
    });
  });

  describe('refreshUser', () => {
    it('should refresh user data successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        token: 'test-token',
        roles: ['user'],
        balance: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedMockUser = {
        ...mockUser,
        balance: 15000, // Updated balance
      };

      (authService.login as jest.Mock).mockResolvedValue(mockUser);
      (userService.getProfile as jest.Mock).mockResolvedValue(updatedMockUser);

      const { result } = renderHook(() => useAuthStore());

      // Login first
      await act(async () => {
        await result.current.login({ username: 'testuser', password: 'password123' });
      });

      expect(result.current.user?.balance).toBe(10000);

      // Refresh user
      await act(async () => {
        await result.current.refreshUser();
      });

      await waitFor(() => {
        expect(result.current.user?.balance).toBe(15000);
      });
    });

    it('should handle 401 error and logout', async () => {
      // Suppress console errors for this test (jsdom navigation error)
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: '1',
        username: 'testuser',
        token: 'test-token',
        roles: ['user'],
        balance: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (authService.login as jest.Mock).mockResolvedValue(mockUser);
      (userService.getProfile as jest.Mock).mockRejectedValue({
        response: { status: 401 },
      });

      const { result } = renderHook(() => useAuthStore());

      // Login first
      await act(async () => {
        await result.current.login({ username: 'testuser', password: 'password123' });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Refresh user with invalid token
      await act(async () => {
        await result.current.refreshUser();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(toast.warning).toHaveBeenCalledWith(
          'Tu sesión expiró. Por favor, inicia sesión nuevamente.'
        );
        // Note: We cannot reliably test window.location.href in jsdom as it triggers navigation
        // The important part is that the user is logged out and warning is shown
      });

      consoleSpy.mockRestore();
    });
  });

  describe('checkAuth', () => {
    it('should return true when authenticated', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        token: 'test-token',
        roles: ['user'],
        balance: 10000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (authService.login as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({ username: 'testuser', password: 'password123' });
      });

      const isAuth = result.current.checkAuth();
      expect(isAuth).toBe(true);
    });

    it('should return false when not authenticated', () => {
      const { result } = renderHook(() => useAuthStore());
      const isAuth = result.current.checkAuth();
      expect(isAuth).toBe(false);
    });
  });
});

