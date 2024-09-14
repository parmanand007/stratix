import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.gaurd';
import { GetUser } from './decorators/get-user.decorator';

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

//   @Delete('logout')
//   @ApiOperation({ summary: 'Logout a user' })
//   @ApiResponse({ status: 200, description: 'User successfully logged out.' })
//   @UseGuards(JwtAuthGuard)
//   async logoutUser(@GetUser() user: User): Promise<void> {
//     return this.authService.logoutUser(user.id);
//   }
}
