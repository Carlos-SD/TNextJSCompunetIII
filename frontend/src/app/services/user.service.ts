import apiService from './api.service';

const userService = {
  async getProfile() {
    return apiService.get('/auth/profile');
  },
};

export default userService;
