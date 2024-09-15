import { IsString, IsEmail, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
