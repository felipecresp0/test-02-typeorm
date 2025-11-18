import { IsString, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  // viene como string en FormData
  @IsNumberString()
  price: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // JSON.stringify([...]) desde el front
  @IsString()
  @IsNotEmpty()
  lessons: string;

  @IsString()
  @IsOptional()
  authorName?: string;

  @IsString()
  @IsOptional()
  authorAvatarUrl?: string;
}