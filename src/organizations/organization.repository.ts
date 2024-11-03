import {  Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

export class OrganizationRepository extends Repository<Organization> {
  // You can add custom methods here if needed
}
