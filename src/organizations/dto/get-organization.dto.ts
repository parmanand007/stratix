import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { GetOrganizationAddressDto } from './get-organization-address.dto';

export class GetOrganizationDto {
    @IsNumber()
    id: number;
  
    @IsString()
    @Expose()
    name: string;
  
    @IsString()
    @Expose()
    domain: string; // Example field

    @ValidateNested()
    @Type(() => GetOrganizationAddressDto)
    @Expose()
    address: GetOrganizationAddressDto;
  }