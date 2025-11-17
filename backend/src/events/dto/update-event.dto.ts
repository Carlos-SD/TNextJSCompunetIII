import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  ArrayMinSize 
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Nombre del evento',
    example: 'Final Copa del Mundo 2024',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del evento',
    example: 'Partido final entre Argentina y Brasil',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Opciones de apuesta para el evento (solo se puede editar el nombre)',
    example: [
      { name: 'Argentina gana' },
      { name: 'Brasil gana' }
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  options?: Array<{ name: string }>;

  @ApiPropertyOptional({
    description: 'Estado del evento',
    enum: EventStatus,
    example: EventStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

