// chat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../users/user.repository';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { UpdateChatRoomDto } from '../dto/update-chat-room.dto';
import { User } from '../../users/entities/user.entity';
import { ChatRoomRepository } from '../chat.repository';
import { ChatRoom } from '../entities/chat.entity';
import { In } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomRepository)
    private readonly chatRoomRepository: ChatRoomRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createChatRoom(createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    const { name, type = 'private', participants = [] } = createChatRoomDto;
    
     // Use findBy with the In operator for finding users
     const participantEntities: User[] = await this.userRepository.findBy({
      id: In(participants),
    });
    return await this.chatRoomRepository.createChatRoom(name, type, participantEntities);
    
  }

  async findAll(): Promise<ChatRoom[]> {
    const chatRooms = await this.chatRoomRepository.find({ relations: ['participants', 'messages'] });
    return chatRooms 
  }

  async findOne(id: number): Promise<ChatRoom> {
    return this.chatRoomRepository.findOneWithRelations(id);
  }

  async update(id: number, updateChatRoomDto: UpdateChatRoomDto): Promise<ChatRoom> {
    const { participants, ...updatedData } = updateChatRoomDto;
    
    // Fetch User entities for the updated participants list
    const participantEntities: User[] = await this.userRepository.findByIds(participants);

    return this.chatRoomRepository.updateChatRoom(id, {
      ...updatedData,
      participants: participantEntities,
    });
  }

  async remove(id: number): Promise<void> {
    const chatRoom = await this.findOne(id);
    await this.chatRoomRepository.remove(chatRoom);
  }
}
