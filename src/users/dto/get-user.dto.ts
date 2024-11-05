import { IsString, IsUUID, IsEmail, IsDate, ValidateNested, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { GetOrganizationDto } from '../../organizations/dto/get-organization.dto';

export class GetUserDto {
    @IsNumber()
    @Expose()
    id: number;
  
    @IsString()
    @Expose()
    name: string;
  
    @IsUUID()
    @Expose()
    uuid: string;
  
    @IsEmail()
    @Expose()
    email: string;
  
    @IsDate()
    @Expose()
    createdAt: Date;
  
    @IsDate()
    @Expose()
    updatedAt: Date;
  
    @ValidateNested()
    @Type(() => GetOrganizationDto)
    @Expose()
    organizationEntity: GetOrganizationDto;
  }