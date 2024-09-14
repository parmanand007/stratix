import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp', description: 'The name of the organization' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'info@acme.com', description: 'The email of the organization' })
  @IsEmail()
  readonly email: string;
}
