import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }

    // sample method for demo purposes
    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email }); // could also be this.findOneBy({ email });, but depending on your IDE/TS settings, could warn that userRepository is not used though. Up to you to use either of the 2 methods
    }
    
    async findUserWithOrganization(userId: number): Promise<User | undefined> {
          return this.findOne({ where: { id: userId }, relations: ['organizationEntity'] });
        }
    // your other custom methods in your repo...
}


// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';

// @Injectable()
// export class UserRepository {
//     constructor(
//         @InjectRepository(User) // Inject the User entity repository
//         private readonly userRepository: Repository<User>, // Use the injected repository directly
//     ) {}

//     async findUserWithOrganization(userId: number): Promise<User | undefined> {
//         return this.userRepository.findOne({
//             where: { id: userId },
//             relations: ['organizationEntity'], // Specify the relation to fetch
//         });
//     }

//     async findByEmail(email: string): Promise<User | undefined> {
//         return this.userRepository.findOne({
//             where: { email },
//         });
//     }

//     // Add other custom methods here as needed
// }

