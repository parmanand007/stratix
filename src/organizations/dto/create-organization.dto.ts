import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp', description: 'The name of the organization' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'acme.com', description: 'The domain of the organization' })
  @IsString()
  readonly domain: string; // Use domain instead of email

  @ApiPropertyOptional({ example: 1, description: 'The ID of the address' })
  @IsInt()
  @IsOptional()
  readonly addressId?: number;
}
