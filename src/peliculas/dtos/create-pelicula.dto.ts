import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePeliculaDto {
  // 🎬 Título obligatorio, texto máximo 100 caracteres
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres' })
  readonly titulo: string;

  // 📅 Año de estreno (entero, razonable)
  @Type(() => Number)
  @IsNumber({}, { message: 'El año debe ser un número' })
  @Min(1888, { message: 'El cine nació en 1888 😉' })
  @Max(new Date().getFullYear() + 1, {
    message: 'El año no puede ser mayor que el actual + 1',
  })
  readonly anio: number;

  // 📝 Descripción opcional
  @IsString()
  @IsOptional()
  readonly descripcion?: string;

  // 🖼️ Imagen opcional (URL válida)
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @IsOptional()
  readonly imagen_url?: string;
}
