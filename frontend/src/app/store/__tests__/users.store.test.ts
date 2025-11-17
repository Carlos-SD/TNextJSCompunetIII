import { renderHook, act } from '@testing-library/react';
import { useUsersStore } from '../users.store';
import usersService from '../../services/users.service';
import { toast } from '../toast.store';

jest.mock('../../services/users.service');
jest.mock('../toast.store', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('usersStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllUsers', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [
        { id: '1', username: 'user1', roles: ['user'], balance: 10000, isActive: true },
        { id: '2', username: 'user2', roles: ['user', 'admin'], balance: 5000, isActive: true },
      ];

      (usersService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useUsersStore());

      await act(async () => {
        await result.current.fetchAllUsers();
      });

      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Failed to fetch users';
      (usersService.getAllUsers as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useUsersStore());

      await act(async () => {
        await result.current.fetchAllUsers();
      });

      expect(result.current.users).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateUserRoles', () => {
    it('should update user roles successfully', async () => {
      const userId = '1';
      const newRoles = ['user', 'admin'];
      const mockUpdatedUser = { id: userId, username: 'user1', roles: newRoles, balance: 10000, isActive: true };

      const initialUsers = [
        { id: '1', username: 'user1', roles: ['user'], balance: 10000, isActive: true },
        { id: '2', username: 'user2', roles: ['user'], balance: 5000, isActive: true },
      ];

      (usersService.updateUserRoles as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const { result } = renderHook(() => useUsersStore());

      // Set initial users
      act(() => {
        result.current.users = initialUsers;
      });

      await act(async () => {
        await result.current.updateUserRoles(userId, newRoles);
      });

      const updatedUser = result.current.users.find((u) => u.id === userId);
      expect(updatedUser?.roles).toEqual(newRoles);
      expect(toast.success).toHaveBeenCalledWith('Roles actualizados correctamente');
    });

    it('should handle update error', async () => {
      const userId = '1';
      const newRoles = ['user', 'admin'];
      const errorMessage = 'Failed to update roles';

      (usersService.updateUserRoles as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useUsersStore());

      try {
        await act(async () => {
          await result.current.updateUserRoles(userId, newRoles);
        });
      } catch (error) {
        // Expected to throw
      }

      expect(result.current.error).toBe(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = '1';

      const initialUsers = [
        { id: '1', username: 'user1', roles: ['user'], balance: 10000, isActive: true },
        { id: '2', username: 'user2', roles: ['user'], balance: 5000, isActive: true },
      ];

      (usersService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useUsersStore());

      // Set initial users
      act(() => {
        result.current.users = initialUsers;
      });

      await act(async () => {
        await result.current.deleteUser(userId);
      });

      expect(result.current.users).toHaveLength(1);
      expect(result.current.users.find((u) => u.id === userId)).toBeUndefined();
      expect(toast.success).toHaveBeenCalledWith('Usuario eliminado correctamente');
    });

    it('should handle delete error', async () => {
      const userId = '1';
      const errorMessage = 'Failed to delete user';

      (usersService.deleteUser as jest.Mock).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useUsersStore());

      try {
        await act(async () => {
          await result.current.deleteUser(userId);
        });
      } catch (error) {
        // Expected to throw
      }

      expect(result.current.error).toBe(errorMessage);
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});

