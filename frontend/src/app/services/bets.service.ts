import apiService from './api.service';
import { Bet, CreateBetDto } from '../interfaces/bet.interface';

export const betsService = {
  async getUserBets(): Promise<Bet[]> {
    const response = await apiService.get<Bet[]>('/bets/my-bets');
    return response.data;
  },

  async createBet(data: CreateBetDto): Promise<Bet> {
    const response = await apiService.post<Bet>('/bets', data);
    return response.data;
  },

  async getBetById(id: string): Promise<Bet> {
    const response = await apiService.get<Bet>(`/bets/${id}`);
    return response.data;
  },
};

export default betsService;

