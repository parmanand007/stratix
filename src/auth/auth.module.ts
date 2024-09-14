import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../users/user.module';
import { OrganizationModule } from '../organizations/organization.module'; // Import OrganizationModule

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure this matches with `JwtStrategy`
      signOptions: { expiresIn: '60m' }, // Token expiration
    }),
    UserModule,
    OrganizationModule, // Add OrganizationModule here
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
