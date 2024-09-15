import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Organization) private organizationRepository: Repository<Organization>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, organizationId, password } = createUserDto;

    // Find organization
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Validate email domain
    const emailDomain = email.split('@')[1];
    const organizationDomain = organization.domain;
    if (emailDomain !== organizationDomain) {
      throw new ConflictException('Email domain does not match the organization’s domain');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create user
    const user = this.userRepository.create({
      name,
      email,
      password,
      organizationEntity: organization, // Assuming you use this property
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error,"===================")
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) {
      const emailDomain = updateUserDto.email.split('@')[1];
      const organization = await this.organizationRepository.findOne({
        where: { id: user.organizationEntity.id }, // Use existing organization id
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      const organizationDomain = organization.domain;
      if (emailDomain !== organizationDomain) {
        throw new ConflictException('Email domain does not match the organization’s domain');
      }
      user.email = updateUserDto.email;
    }
    if (updateUserDto.uuid) {
      // Check UUID against existing organizations
      const organization = await this.organizationRepository.findOne({
        where: { uuid: updateUserDto.uuid },
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      user.uuid = updateUserDto.uuid;
    }

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
