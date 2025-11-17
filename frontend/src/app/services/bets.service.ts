import apiService from './api.service';
import { Bet, CreateBetDto } from '../interfaces/bet.interface';

export const betsService = {
  async getUserBets(userId: string): Promise<Bet[]> {
    // Agregar timestamp para evitar caché del navegador
    const timestamp = new Date().getTime();
    return await apiService.get(`/bets/user/${userId}?_t=${timestamp}`);
  },

  async createBet(data: CreateBetDto): Promise<Bet> {
    return await apiService.post('/bets', data);
  },

  async getBetById(id: string): Promise<Bet> {
    return await apiService.get(`/bets/${id}`);
  },
};

export default betsService;

