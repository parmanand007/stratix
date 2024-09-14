import { IsString, IsEmail, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 1, description: 'The ID of the organization the user belongs to' })
  @IsInt()
  readonly organizationId: number; // Use integer ID for the organization

  @ApiProperty({ example: 'password123', description: 'The password for the user', required: false })
  @IsOptional()
  @IsString()
  readonly password?: string; // Optional password field
}
