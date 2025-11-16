import apiService from './api.service';
import { Bet, CreateBetDto } from '../interfaces/bet.interface';

export const betsService = {
  async getUserBets(userId: string): Promise<Bet[]> {
    return await apiService.get<Bet[]>(`/bets/user/${userId}`);
  },

  async createBet(data: CreateBetDto): Promise<Bet> {
    return await apiService.post<Bet>('/bets', data);
  },

  async getBetById(id: string): Promise<Bet> {
    return await apiService.get<Bet>(`/bets/${id}`);
  },
};

export default betsService;

