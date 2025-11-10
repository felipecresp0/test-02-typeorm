import { PartialType } from '@nestjs/mapped-types';
import { CreatePeliculaDto } from './create-pelicula.dto';

// 🎯 PartialType transforma todos los campos del CreatePeliculaDto
// en opcionales automáticamente.
// Ideal para PATCH o actualizaciones parciales.

// 🧩 DTO de actualización (hereda todas las validaciones pero las vuelve opcionales)
export class UpdatePeliculaDto extends PartialType(CreatePeliculaDto) {}
