import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
