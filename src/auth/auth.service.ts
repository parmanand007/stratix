import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email } = loginUserDto;
    const domainFromEmail = email.split('@')[1];

    const organization = await this.organizationRepository.findOne({
      where: { domain: domainFromEmail },
    });

    if (!organization) {
      throw new NotFoundException('No organization found for the provided email domain');
    }

    const user = await this.userRepository.findOne({
      where: { email, organizationId: organization.id },
    });

    if (!user) {
      throw new NotFoundException('User not found for the provided email');
    }

    return user;
  }

  async signupUser(signupUserDto: SignupUserDto): Promise<User> {
    const { email, organizationId } = signupUserDto;
    const domainFromEmail = email.split('@')[1];

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization || domainFromEmail !== organization.domain) {
      throw new ConflictException('Email domain does not match organization domain');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email, organizationId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists in the organization');
    }

    const user = this.userRepository.create(signupUserDto);
    return this.userRepository.save(user);
  }

  async logoutUser(userId: string): Promise<void> {
    // Implement logout logic if needed (e.g., invalidate session or token)
    // For now, just a placeholder
  }
}
