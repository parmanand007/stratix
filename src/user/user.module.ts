import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Organization } from '../organization/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization]),  // Import User and Organization entities
  ],
  providers: [UserService],  // Provide the UserService
  controllers: [UserController],  // Register the UserController
  exports: [UserService],  // Export UserService if needed in other modules
})
export class UserModule {}
