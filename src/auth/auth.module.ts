import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../jwt/jwt.strategy'; // Ensure this path is correct
import { UserModule } from '../users/user.module';
import { OrganizationModule } from '../organizations/organization.module';
import { AuthController } from './auth.controller';
import { RedisModule } from './redis.module';
import { PassportModule } from '@nestjs/passport';
// import { JwtAuthGuard } from 'src/jwt/jwt-auth.gaurd';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.gaurd';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Adjust expiration as necessary
      }),
    }),
    forwardRef(() => OrganizationModule),
    UserModule,
    RedisModule,
  ],
  providers: [AuthService, JwtStrategy, TokenBlacklistService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, TokenBlacklistService, JwtAuthGuard,JwtModule], // Export JwtAuthGuard if needed in other modules
})
export class AuthModule {}
