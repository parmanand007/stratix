import { Controller, Post, Body, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../jwt/jwt-auth.gaurd';
import { GetUser } from './decorators/get-user.decorator';
import { LogoutUserDto } from './dto/logout-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user by email and verify domain' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Signup a new user and assign to an organization' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 409, description: 'Email domain does not match organization domain' })
  async signupUser(@Body() signupUserDto: SignupUserDto): Promise<User> {
    return this.authService.signupUser(signupUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK) // Set status code to 200
  @ApiOperation({ summary: 'Logout a user' })
  @ApiBody({ type: LogoutUserDto, description: 'The token to invalidate' })
  @ApiResponse({ status: 200, description: 'Successfully logged out', type: String }) // Updated to reflect response
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Body() logoutUserDto: LogoutUserDto): Promise<{ message: string }> {
    await this.authService.logoutUser(logoutUserDto.token);
    return { message: 'Successfully logged out' }; // Return a response with a message
  }
}
