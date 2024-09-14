import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'john.doe@acme.com', description: 'Email of the user' })
  @IsEmail()
  readonly email: string;
}
