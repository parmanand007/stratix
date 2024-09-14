import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrganizationService } from '../organizations/organization.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtService: JwtService,
  ) {}

  async signupUser(signupUserDto: SignupUserDto): Promise<User> {
    const { email, password, name } = signupUserDto;
    const domain = email.split('@')[1];

    // Fetch organization by domain
    const organization = await this.organizationService.findByDomain(domain);
    if (!organization) {
      throw new ConflictException('Email domain does not match organization domain');
    }

    // Create user with organization entity instead of organizationId
    const user = this.userService.createUser({
      name,
      email,
      password,
      organizationId: organization.id, // Set the organization entity directly
    });

    return user;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT token
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async logoutUser(userId: string): Promise<void> {
    // Implement your logout logic here
    // For JWT, typically you would handle this on the client side by deleting the token
  }
}
