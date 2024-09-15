import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrganizationService } from '../organizations/organization.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
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
    const payload = { sub: user.id,email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async logoutUser(token: string): Promise<void> {
    // Get the expiration time of the token
    const { exp } = this.jwtService.decode(token) as { exp: number };
    
    if (!exp) {
      throw new UnauthorizedException('Invalid token');
    }

    // Blacklist the token
    await this.tokenBlacklistService.blacklistToken(token, exp - Math.floor(Date.now() / 1000));
  }
}
