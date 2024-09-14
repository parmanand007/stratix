import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'The name of the user' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'The organization ID the user belongs to' })
  @IsOptional()
  @IsUUID('4')
  readonly uuid?: string;
}
