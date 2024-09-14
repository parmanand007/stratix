import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'The password of the user' })
  @IsString()
  readonly password: string;
}
