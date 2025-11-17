import usersService from '../users.service';
import apiService from '../api.service';

jest.mock('../api.service');

describe('usersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { id: '1', username: 'user1', roles: ['user'] },
        { id: '2', username: 'user2', roles: ['user', 'admin'] },
      ];

      (apiService.get as jest.Mock).mockResolvedValue(mockUsers);

      const result = await usersService.getAllUsers();

      expect(apiService.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUserRoles', () => {
    it('should update user roles', async () => {
      const userId = '123';
      const roles = ['user', 'admin'];
      const mockResponse = { id: userId, roles };

      (apiService.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await usersService.updateUserRoles(userId, roles);

      expect(apiService.patch).toHaveBeenCalledWith(`/users/${userId}`, {
        roles,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUserById', () => {
    it('should fetch a user by ID', async () => {
      const userId = '123';
      const mockUser = { id: userId, username: 'user1', roles: ['user'] };

      (apiService.get as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersService.getUserById(userId);

      expect(apiService.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '123';

      (apiService.delete as jest.Mock).mockResolvedValue(undefined);

      await usersService.deleteUser(userId);

      expect(apiService.delete).toHaveBeenCalledWith(`/users/${userId}`);
    });
  });
});

