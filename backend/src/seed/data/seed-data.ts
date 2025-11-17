import { EventStatus } from '../../events/entities/event.entity';
import { BetStatus } from '../../bets/entities/bet.entity';

export const seedData = {
  users: [
    {
      username: 'admin',
      roles: ['admin', 'user'],
      balance: 50000,
      isActive: true,
    },
    {
      username: 'usuario1',
      roles: ['user'],
      balance: 15000,
      isActive: true,
    },
    {
      username: 'usuario2',
      roles: ['user'],
      balance: 8000,
      isActive: true,
    },
    {
      username: 'usuario3',
      roles: ['user'],
      balance: 12000,
      isActive: true,
    },
  ],

  events: [
    {
      name: 'Final Liga Española',
      description: 'Real Madrid vs Barcelona - Final de Copa del Rey',
      status: EventStatus.OPEN,
      finalResult: undefined,
      options: [
        { name: 'Real Madrid', odds: 2.5 },
        { name: 'Barcelona', odds: 2.8 },
        { name: 'Empate', odds: 3.2 },
      ],
    },
    {
      name: 'Champions League',
      description: 'Manchester City vs Bayern Munich',
      status: EventStatus.OPEN,
      finalResult: undefined,
      options: [
        { name: 'Manchester City', odds: 1.9 },
        { name: 'Bayern Munich', odds: 3.5 },
        { name: 'Empate', odds: 3.0 },
      ],
    },
    {
      name: 'NBA Finals',
      description: 'Lakers vs Celtics - Juego 7',
      status: EventStatus.OPEN,
      finalResult: undefined,
      options: [
        { name: 'Lakers', odds: 2.2 },
        { name: 'Celtics', odds: 1.9 },
      ],
    },
    {
      name: 'Super Bowl',
      description: 'Chiefs vs 49ers',
      status: EventStatus.CLOSED,
      finalResult: 'Chiefs',
      options: [
        { name: 'Chiefs', odds: 1.7 },
        { name: '49ers', odds: 2.3 },
      ],
    },
    {
      name: 'Tennis - Roland Garros',
      description: 'Djokovic vs Nadal',
      status: EventStatus.OPEN,
      finalResult: undefined,
      options: [
        { name: 'Djokovic', odds: 2.1 },
        { name: 'Nadal', odds: 1.8 },
      ],
    },
    {
      name: 'Fórmula 1 - Gran Premio',
      description: 'Carrera principal',
      status: EventStatus.OPEN,
      finalResult: undefined,
      options: [
        { name: 'Hamilton', odds: 2.5 },
        { name: 'Verstappen', odds: 2.0 },
        { name: 'Leclerc', odds: 3.0 },
      ],
    },
  ],

  bets: [
    {
      username: 'usuario1',
      eventName: 'Final Liga Española',
      selectedOption: 'Real Madrid',
      odds: 2.5,
      amount: 500,
      status: BetStatus.PENDING,
      profit: 0,
    },
    {
      username: 'usuario1',
      eventName: 'Champions League',
      selectedOption: 'Manchester City',
      odds: 1.9,
      amount: 1000,
      status: BetStatus.PENDING,
      profit: 0,
    },
    {
      username: 'usuario2',
      eventName: 'Final Liga Española',
      selectedOption: 'Barcelona',
      odds: 2.8,
      amount: 300,
      status: BetStatus.PENDING,
      profit: 0,
    },
    {
      username: 'usuario2',
      eventName: 'NBA Finals',
      selectedOption: 'Lakers',
      odds: 2.2,
      amount: 750,
      status: BetStatus.PENDING,
      profit: 0,
    },
    {
      username: 'usuario3',
      eventName: 'Champions League',
      selectedOption: 'Bayern Munich',
      odds: 3.5,
      amount: 400,
      status: BetStatus.PENDING,
      profit: 0,
    },
    {
      username: 'usuario3',
      eventName: 'Tennis - Roland Garros',
      selectedOption: 'Nadal',
      odds: 1.8,
      amount: 600,
      status: BetStatus.PENDING,
      profit: 0,
    },
    {
      username: 'usuario1',
      eventName: 'Super Bowl',
      selectedOption: 'Chiefs',
      odds: 1.7,
      amount: 1000,
      status: BetStatus.WON,
      profit: 700,
    },
    {
      username: 'usuario2',
      eventName: 'Super Bowl',
      selectedOption: '49ers',
      odds: 2.3,
      amount: 500,
      status: BetStatus.LOST,
      profit: 0,
    },
  ],
};
