import apiService from './api.service';
import { User } from '../interfaces/user.interface';

export interface UpdateUserRolesDto {
  roles: string[];
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    return await apiService.get<User[]>('/users');
  },

  async getUserById(id: string): Promise<User> {
    return await apiService.get<User>(`/users/${id}`);
  },

  async updateUserRoles(id: string, roles: string[]): Promise<User> {
    return await apiService.patch<User>(`/users/${id}`, { roles });
  },

  async deleteUser(id: string): Promise<void> {
    return await apiService.delete(`/users/${id}`);
  },
};

export default usersService;

