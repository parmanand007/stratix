import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { Organization } from 'src/organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
