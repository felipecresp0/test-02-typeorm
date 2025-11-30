import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  content: string;
}
