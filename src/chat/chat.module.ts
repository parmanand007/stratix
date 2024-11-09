// chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';

import { UserRepository } from '../users/user.repository'; // Make sure UserRepository is correctly imported
import { ChatRoomRepository } from './chat.repository';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom,User, UserRepository]), // Register repositories
  ],
  controllers: [ChatController],
  providers: [ChatService,ChatRoomRepository, UserRepository],
  exports: [ChatService], // Export ChatService if other modules need to use it
})
export class ChatModule {}
