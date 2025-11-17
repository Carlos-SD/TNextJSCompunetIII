import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { EventOption } from '../events/entities/event-option.entity';
import { Bet } from '../bets/entities/bet.entity';
import { EventStatus } from '../events/entities/event.entity';
import { BetStatus } from '../bets/entities/bet.entity';
import { seedData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventOption)
    private readonly eventOptionRepository: Repository<EventOption>,
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
  ) {}

  async seedAll() {
    try {
      await this.seedUsers();
      await this.seedEvents();
      await this.seedBets();

      return { message: 'Seed completado exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  async seedUsers() {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    for (const userData of seedData.users) {
      const existingUser = await this.userRepository.findOne({
        where: { username: userData.username },
      });

      if (!existingUser) {
        const user = this.userRepository.create({
          username: userData.username,
          password: hashedPassword,
          roles: userData.roles,
          balance: userData.balance,
          isActive: userData.isActive,
        });
        await this.userRepository.save(user);
      }
    }
  }

  async seedEvents() {
    for (const eventData of seedData.events) {
      const existingEvent = await this.eventRepository.findOne({
        where: { name: eventData.name },
      });

      if (!existingEvent) {
        const event = this.eventRepository.create({
          name: eventData.name,
          description: eventData.description,
          status: eventData.status,
          finalResult: (eventData as any).finalResult || null,
        });
        const savedEvent = await this.eventRepository.save(event);

        // Crear opciones del evento
        for (const optionData of eventData.options) {
          const option = this.eventOptionRepository.create({
            name: optionData.name,
            odds: optionData.odds,
            eventId: savedEvent.id,
          });
          await this.eventOptionRepository.save(option);
        }
      }
    }
  }

  async seedBets() {
    const users = await this.userRepository.find();
    const events = await this.eventRepository.find({ relations: ['options'] });

    if (users.length === 0 || events.length === 0) {
      return;
    }

    for (const betData of seedData.bets) {
      const user = users.find((u) => u.username === betData.username);
      const event = events.find((e) => e.name === betData.eventName);

      if (user && event) {
        const option = event.options.find((o) => o.name === betData.selectedOption);

        if (option) {
          const bet = this.betRepository.create({
            selectedOption: betData.selectedOption,
            odds: betData.odds,
            amount: betData.amount,
            status: betData.status,
            profit: betData.profit,
            userId: user.id,
            eventId: event.id,
          });
          await this.betRepository.save(bet);
        }
      }
    }
  }

  async clearAll() {
    try {
      await this.betRepository.query('TRUNCATE TABLE bets CASCADE');
      await this.eventOptionRepository.query('TRUNCATE TABLE event_options CASCADE');
      await this.eventRepository.query('TRUNCATE TABLE events CASCADE');
      await this.userRepository.query('TRUNCATE TABLE users CASCADE');
      
      return { message: 'Todos los datos limpiados exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

