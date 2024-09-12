import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Organization) private organizationRepository: Repository<Organization>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, organizationId } = createUserDto;

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const emailDomain = email.split('@')[1];
    const organizationDomain = organization.domain;
    if (emailDomain !== organizationDomain) {
      throw new ConflictException('Email domain does not match the organization’s domain');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = this.userRepository.create({
      name,
      email,
      organizationId,
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
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

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) {
      const emailDomain = updateUserDto.email.split('@')[1];
      const organization = await this.organizationRepository.findOne({
        where: { id: user.organizationId },
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      const organizationDomain = organization.domain.split('@')[1];
      if (emailDomain !== organizationDomain) {
        throw new ConflictException('Email domain does not match the organization’s domain');
      }
      user.email = updateUserDto.email;
    }
    if (updateUserDto.organizationId) {
      const organization = await this.organizationRepository.findOne({
        where: { id: updateUserDto.organizationId },
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }
      user.organizationId = updateUserDto.organizationId;
    }

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
