// src/organization/organization.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({ where: { id } });
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    await this.organizationRepository.update(id, updateOrganizationDto);
    return this.organizationRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.organizationRepository.delete(id);
  }
}