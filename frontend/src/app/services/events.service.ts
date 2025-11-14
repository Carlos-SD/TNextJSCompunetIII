import apiService from './api.service';

const eventsService = {
  async getOpen() {
    return apiService.get('/events/open');
  },
};

export default eventsService;
