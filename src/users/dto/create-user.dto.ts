import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import type { UserRole } from '../../common/decorators/roles.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  displayName: string;

  @IsOptional()
  role?: UserRole;
}
