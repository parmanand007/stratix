import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationAddressDto } from './create-organization-address.dto';
export class UpdateOrganizationAddressDto extends PartialType(CreateOrganizationAddressDto) {}
