import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet, BetStatus } from './entities/bet.entity';
import { CreateBetDto } from './dto/create-bet.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { EventStatus } from '../events/entities/event.entity';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
  ) {}

  async create(createBetDto: CreateBetDto): Promise<Bet> {
    // Verificar que el usuario existe y tiene saldo suficiente
    const user = await this.usersService.findOne(createBetDto.userId);
    
    if (Number(user.balance) < createBetDto.amount) {
      throw new BadRequestException(
        `Saldo insuficiente. Saldo actual: ${user.balance}, Monto requerido: ${createBetDto.amount}`,
      );
    }

    // Verificar que el evento existe y está abierto
    const event = await this.eventsService.findOne(createBetDto.eventId);

    if (event.status !== EventStatus.OPEN) {
      throw new BadRequestException('El evento no está disponible para apuestas');
    }

    // Verificar que el usuario no tenga ya una apuesta en este evento
    const existingBet = await this.betRepository.findOne({
      where: {
        userId: createBetDto.userId,
        eventId: createBetDto.eventId,
        status: BetStatus.PENDING,
      },
    });

    if (existingBet) {
      throw new BadRequestException(
        'Ya tienes una apuesta activa en este evento. No puedes apostar más de una vez por evento.',
      );
    }

    // Verificar que la opción seleccionada existe en el evento
    const selectedOption = event.options.find(
      (option) => option.name === createBetDto.selectedOption,
    );

    if (!selectedOption) {
      throw new BadRequestException(
        `La opción '${createBetDto.selectedOption}' no existe en este evento`,
      );
    }

    // Descontar el monto del saldo del usuario
    await this.usersService.updateBalance(
      createBetDto.userId,
      -createBetDto.amount,
    );

    // Crear la apuesta
    const bet = this.betRepository.create({
      userId: createBetDto.userId,
      eventId: createBetDto.eventId,
      selectedOption: createBetDto.selectedOption,
      odds: selectedOption.odds,
      amount: createBetDto.amount,
      status: BetStatus.PENDING,
      profit: 0,
    });

    return await this.betRepository.save(bet);
  }

  async findAll(): Promise<Bet[]> {
    return await this.betRepository.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Bet> {
    const bet = await this.betRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'event.options'],
    });

    if (!bet) {
      throw new NotFoundException(`Apuesta con ID '${id}' no encontrada`);
    }

    return bet;
  }

  async findByUser(userId: string): Promise<Bet[]> {
    // Verificar que el usuario existe
    await this.usersService.findOne(userId);

    return await this.betRepository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEvent(eventId: string): Promise<Bet[]> {
    // Verificar que el evento existe
    await this.eventsService.findOne(eventId);

    return await this.betRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async processEventBets(eventId: string): Promise<void> {
    const event = await this.eventsService.findOne(eventId);

    if (event.status !== EventStatus.CLOSED) {
      throw new BadRequestException('El evento debe estar cerrado para procesar apuestas');
    }

    if (!event.finalResult) {
      throw new BadRequestException('El evento no tiene un resultado final definido');
    }

    // Obtener todas las apuestas pendientes del evento
    const bets = await this.betRepository.find({
      where: { eventId, status: BetStatus.PENDING },
      relations: ['user'],
    });

    for (const bet of bets) {
      if (bet.selectedOption === event.finalResult) {
        // Apuesta ganada
        const profit = Number(bet.amount) * Number(bet.odds);
        bet.status = BetStatus.WON;
        bet.profit = profit;
        
        // Abonar la ganancia al saldo del usuario
        await this.usersService.updateBalance(bet.userId, profit);
      } else {
        // Apuesta perdida
        bet.status = BetStatus.LOST;
        bet.profit = 0;
      }

      await this.betRepository.save(bet);
    }
  }

  async updateBetOption(id: string, newOptionName: string): Promise<Bet> {
    const bet = await this.betRepository.findOne({ where: { id } });
    
    if (!bet) {
      throw new NotFoundException(`Apuesta con ID '${id}' no encontrada`);
    }

    bet.selectedOption = newOptionName;
    return await this.betRepository.save(bet);
  }

  async remove(id: string): Promise<void> {
    const bet = await this.findOne(id);

    if (bet.status !== BetStatus.PENDING) {
      throw new BadRequestException('Solo se pueden eliminar apuestas pendientes');
    }

    // Devolver el dinero al usuario
    await this.usersService.updateBalance(bet.userId, Number(bet.amount));

    await this.betRepository.remove(bet);
  }

  async getUserStats(userId: string): Promise<any> {
    const bets = await this.findByUser(userId);

    const stats = {
      totalBets: bets.length,
      pendingBets: bets.filter((b) => b.status === BetStatus.PENDING).length,
      wonBets: bets.filter((b) => b.status === BetStatus.WON).length,
      lostBets: bets.filter((b) => b.status === BetStatus.LOST).length,
      totalAmountBet: bets.reduce((sum, b) => sum + Number(b.amount), 0),
      totalProfit: bets
        .filter((b) => b.status === BetStatus.WON)
        .reduce((sum, b) => sum + Number(b.profit), 0),
      totalLoss: bets
        .filter((b) => b.status === BetStatus.LOST)
        .reduce((sum, b) => sum + Number(b.amount), 0),
    };

    return stats;
  }
}
