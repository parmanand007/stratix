import { IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class GetOrganizationAddressDto {
//   @IsNumber()
//   @Expose()
//   id: number;

  @IsString()
  @Expose()
  street: string;

  @IsString()
  @Expose()
  city: string;

  @IsString()
  @Expose()
  state: string;

  @IsString()
  @Expose()
  country: string;
}
