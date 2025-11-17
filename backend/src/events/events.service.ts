import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { EventOption } from './entities/event-option.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CloseEventDto } from './dto/close-event.dto';
import { BetsService } from '../bets/bets.service';
import { BetStatus } from '../bets/entities/bet.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventOption)
    private readonly eventOptionRepository: Repository<EventOption>,
    @Inject(forwardRef(() => BetsService))
    private readonly betsService: BetsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      name: createEventDto.name,
      description: createEventDto.description,
      status: EventStatus.OPEN,
    });

    const savedEvent = await this.eventRepository.save(event);

    const options = createEventDto.options.map((optionDto) =>
      this.eventOptionRepository.create({
        name: optionDto.name,
        odds: optionDto.odds,
        eventId: savedEvent.id,
      }),
    );

    await this.eventOptionRepository.save(options);

    return this.findOne(savedEvent.id);
  }

  async findAll(): Promise<Event[]> {
    const events = await this.eventRepository.find({
      relations: ['options'],
      order: { createdAt: 'DESC' },
    });

    // Ordenar opciones de cada evento por ID para mantener consistencia
    events.forEach(event => {
      if (event.options) {
        event.options.sort((a, b) => a.id.localeCompare(b.id));
      }
    });

    return events;
  }

  async findAllOpen(): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: { status: EventStatus.OPEN },
      relations: ['options'],
      order: { createdAt: 'DESC' },
    });

    // Ordenar opciones de cada evento por ID para mantener consistencia
    events.forEach(event => {
      if (event.options) {
        event.options.sort((a, b) => a.id.localeCompare(b.id));
      }
    });

    return events;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['options', 'bets', 'bets.user'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID '${id}' no encontrado`);
    }

    // Ordenar opciones por ID para mantener consistencia
    if (event.options) {
      event.options.sort((a, b) => a.id.localeCompare(b.id));
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === EventStatus.CLOSED) {
      throw new BadRequestException('No se puede modificar un evento cerrado');
    }

    // Solo se puede modificar nombre del evento y nombre de opciones (NO cuotas)
    if (updateEventDto.name) {
      event.name = updateEventDto.name;
    }
    
    if (updateEventDto.description !== undefined) {
      event.description = updateEventDto.description;
    }

    // Actualizar nombres de opciones (pero no las cuotas)
    if (updateEventDto.options && updateEventDto.options.length > 0) {
      // PASO 1: Crear un mapa de cambios (oldName → newName) SIN modificar el array todavía
      const nameChanges = new Map<string, string>();
      for (let i = 0; i < event.options.length && i < updateEventDto.options.length; i++) {
        const oldName = event.options[i].name;
        const newName = updateEventDto.options[i].name;
        
        if (newName && newName !== oldName) {
          nameChanges.set(oldName, newName);
        }
      }
      
      // PASO 2: Actualizar las opciones del evento
      for (let i = 0; i < event.options.length && i < updateEventDto.options.length; i++) {
        const oldName = event.options[i].name;
        const newName = updateEventDto.options[i].name;
        
        if (newName && newName !== oldName) {
          event.options[i].name = newName;
        }
      }
      await this.eventOptionRepository.save(event.options);
      
      // PASO 3: Actualizar todas las apuestas pendientes usando el mapa de cambios
      if (nameChanges.size > 0) {
        const bets = await this.betsService.findByEvent(id);
        
        for (const bet of bets) {
          if (bet.status === BetStatus.PENDING && nameChanges.has(bet.selectedOption)) {
            const newName = nameChanges.get(bet.selectedOption)!;
            await this.betsService.updateBetOption(bet.id, newName);
          }
        }
      }
    }

    await this.eventRepository.save(event);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);

    // Solo se pueden eliminar eventos abiertos
    if (event.status === EventStatus.CLOSED) {
      throw new BadRequestException('No se puede eliminar un evento cerrado');
    }

    // Devolver el dinero a todos los usuarios que apostaron en este evento
    const bets = await this.betsService.findByEvent(id);
    for (const bet of bets) {
      if (bet.status === BetStatus.PENDING) {
        // Devolver el monto apostado al usuario
        await this.usersService.updateBalance(bet.userId, Number(bet.amount));
        // Eliminar la apuesta
        await this.betsService.remove(bet.id);
      }
    }

    // Eliminar el evento
    await this.eventRepository.remove(event);
  }

  async closeEvent(id: string, closeEventDto: CloseEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === EventStatus.CLOSED) {
      throw new BadRequestException('El evento ya está cerrado');
    }

    const optionExists = event.options.some(
      (option) => option.name === closeEventDto.finalResult,
    );

    if (!optionExists) {
      throw new BadRequestException(
        `El resultado '${closeEventDto.finalResult}' no es una opción válida para este evento`,
      );
    }

    event.status = EventStatus.CLOSED;
    event.finalResult = closeEventDto.finalResult;

    const savedEvent = await this.eventRepository.save(event);

    // Procesar las apuestas del evento
    try {
      await this.betsService.processEventBets(id);
    } catch (error) {
      // Lanzar el error para que el frontend lo vea
      throw new BadRequestException(`Error al procesar apuestas: ${error.message}`);
    }

    return savedEvent;
  }

  async getEventOption(optionId: string): Promise<EventOption> {
    const option = await this.eventOptionRepository.findOne({
      where: { id: optionId },
      relations: ['event'],
    });

    if (!option) {
      throw new NotFoundException(`Opción con ID '${optionId}' no encontrada`);
    }

    return option;
  }

  async validateOptionBelongsToEvent(
    eventId: string,
    optionId: string,
  ): Promise<boolean> {
    const option = await this.eventOptionRepository.findOne({
      where: { id: optionId, eventId },
    });

    return !!option;
  }
}
