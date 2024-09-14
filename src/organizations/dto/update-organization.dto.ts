import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Corp', description: 'The name of the organization' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'info@acme.com', description: 'The email of the organization' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
