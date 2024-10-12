import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Corp', description: 'The name of the organization' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'acme.com', description: 'The domain of the organization' })
  @IsOptional()
  @IsString()
  readonly domain?: string; // Use domain instead of email

  @ApiPropertyOptional({ example: 1, description: 'The ID of the address' })
  @IsInt()
  @IsOptional()
  readonly addressId?: number;
}
