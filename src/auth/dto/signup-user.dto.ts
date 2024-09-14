import { IsString, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({ example: 'john.doe', description: 'Name of the user' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'john.doe@acme.com', description: 'Email of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'b1b9cf28-4e3f-4b9c-91d4-1c684a99e6ef', description: 'Organization ID' })
  @IsUUID()
  readonly organizationId: string;
}
