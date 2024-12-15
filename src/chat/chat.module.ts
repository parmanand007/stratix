// chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controllers/chat.controller';

import { UserRepository } from '../users/user.repository'; // Make sure UserRepository is correctly imported
import { ChatRoomRepository } from './chat.repository';
import { ChatService } from './services/chat.service';
import { ChatRoom } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatMessageController } from './controllers/chat-message.controller';
import { ChatMessageService } from './services/chat-message.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom,User, UserRepository,ChatMessage]), // Register repositories
  ],
  controllers: [ChatController,ChatMessageController],
  providers: [ChatService,ChatRoomRepository, UserRepository,ChatMessageService,ChatGateway],
  exports: [ChatService,ChatMessageService], // Export ChatService if other modules need to use it
})
export class ChatModule {}
