import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp', description: 'The name of the organization' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'acme.com', description: 'The domain of the organization' })
  @IsString()
  readonly domain: string; // Use domain instead of email
}
