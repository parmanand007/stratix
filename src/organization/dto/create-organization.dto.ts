import { IsString, IsEmail } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;
}
