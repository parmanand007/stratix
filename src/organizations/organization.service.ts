// src/organization/organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { OrganizationAddress } from './entities/organization-address.entity';
import { CreateOrganizationAddressDto } from './dto/create-organization-address.dto';
import { UpdateOrganizationAddressDto } from './dto/update-organization-address.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationAddress)
    private readonly organizationAddressRepository: Repository<OrganizationAddress>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const { addressId, ...orgData } = createOrganizationDto;
    const organization = this.organizationRepository.create(orgData);

    if (addressId) {
      const address = await this.organizationAddressRepository.findOne({ where: { id: addressId } });
      if (!address) {
        throw new NotFoundException('Address not found');
      }
      organization.address = address;
    }

    return this.organizationRepository.save(organization);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Organization>> {
    return paginate(query, this.organizationRepository, {
      sortableColumns: ['name', 'domain'],
      searchableColumns: ['name', 'domain'],
      defaultSortBy: [['name', 'ASC']],
      filterableColumns: {
        status: true,
      },
    }); 
  }

  async findOne(id: number): Promise<Organization> {
    return this.organizationRepository.findOne({ where: { id } });
  }


  async update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const { addressId, ...orgData } = updateOrganizationDto;
    const organization = await this.organizationRepository.findOne({where:{id}});

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    this.organizationRepository.merge(organization, orgData);

    if (addressId) {
      const address = await this.organizationAddressRepository.findOne({ where: { id: addressId } });
      if (!address) {
        throw new NotFoundException('Address not found');
      }
      organization.address = address;
    }

    return this.organizationRepository.save(organization);
  }

  async remove(id: string): Promise<void> {
    await this.organizationRepository.delete(id);
  }

  async findByDomain(domain: string): Promise<Organization> {
    return this.organizationRepository.findOne({ where: { domain } });
  }

  // Additional CRUD methods for OrganizationAddress
  async createAddress(createAddressDto: CreateOrganizationAddressDto): Promise<OrganizationAddress> {
    const address = this.organizationAddressRepository.create(createAddressDto);
    return this.organizationAddressRepository.save(address);
  }

  async findAllAddresses(query: PaginateQuery): Promise<Paginated<OrganizationAddress>> {
    return paginate(query, this.organizationAddressRepository, {
      sortableColumns: ['street', 'city', 'state', 'postalCode'], // Change these according to your fields
      searchableColumns: ['street', 'city', 'state'], // Change these according to your fields
      defaultSortBy: [['street', 'ASC']],
      filterableColumns: {
        // Define filterable columns if any
        state: true, // Assuming you have a status field
      },
    });
  }

  async findOneAddress(id: number): Promise<OrganizationAddress> {
    const address = await this.organizationAddressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async updateAddress(id: number, updateAddressDto: UpdateOrganizationAddressDto): Promise<OrganizationAddress> {
    const address = await this.findOneAddress(id);
    this.organizationAddressRepository.merge(address, updateAddressDto);
    return this.organizationAddressRepository.save(address);
  }

  async removeAddress(id: number): Promise<void> {
    const address = await this.findOneAddress(id);
    await this.organizationAddressRepository.remove(address);
  }
}
