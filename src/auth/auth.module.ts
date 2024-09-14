import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../users/user.module';
import { OrganizationModule } from '../organizations/organization.module'; // Import OrganizationModule
import { AuthController } from './auth.controller';
import { UserService } from 'src/users/user.service';
import { OrganizationService } from 'src/organizations/organization.service';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET, // Ensure this matches with `JwtStrategy`
//       signOptions: { expiresIn: '60m' }, // Token expiration
//     }),
//     UserModule,
//     OrganizationModule, // Add OrganizationModule here
//   ],
//   providers: [UserService, OrganizationService, JwtStrategy,AuthService],
//   exports: [AuthService],
//   controllers: [AuthController],
// })
// export class AuthModule {}


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure this matches with `JwtStrategy`
      signOptions: { expiresIn: '60m' }, // Token expiration
    }),
    UserModule,
    OrganizationModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}