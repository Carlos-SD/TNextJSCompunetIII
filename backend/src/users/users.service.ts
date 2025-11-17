import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Bet } from '../bets/entities/bet.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw new ConflictException(`El nombre de usuario '${createUserDto.username}' ya está en uso`);
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      const user = this.userRepository.create({
        username: createUserDto.username,
        password: hashedPassword,
        roles: createUserDto.roles ?? ['user'],
        balance: createUserDto.balance ?? 10000,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['bets'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['bets', 'bets.event'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['bets', 'bets.event'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario '${username}' no encontrado`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`El nombre de usuario '${updateUserDto.username}' ya está en uso`);
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    
    // Eliminar todas las apuestas del usuario primero
    await this.betRepository.delete({ userId: id });
    
    // Ahora eliminar el usuario
    await this.userRepository.remove(user);
  }

  async updateBalance(id: string, amount: number): Promise<User> {
    const user = await this.findOne(id);
    
    if (user.balance + amount < 0) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const oldBalance = Number(user.balance);
    user.balance = oldBalance + amount;
    
    return await this.userRepository.save(user);
  }

  async getUserBalance(id: string): Promise<{ balance: number }> {
    const user = await this.findOne(id);
    return { balance: Number(user.balance) };
  }
}
