import apiService from './api.service';
import { AuthResponse } from '../interfaces/user.interface';

const userService = {
  async getProfile(): Promise<AuthResponse> {
    const response = await apiService.get<{ user: any }>('/auth/profile');
  
    const token = localStorage.getItem('authToken') || '';
    return {
      id: response.user.id,
      username: response.user.username,
      balance: Number(response.user.balance),
      roles: response.user.roles || [],
      isActive: response.user.isActive,
      token: token,
    };
  },
};

export default userService;
