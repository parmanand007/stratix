import { IsString, IsEmail, IsUUID,IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsUUID('4')
  readonly organizationId: string;
}
