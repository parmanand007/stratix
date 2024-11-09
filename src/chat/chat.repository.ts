import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export class ChatRoomRepository extends Repository<ChatRoom> {
    constructor(
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>
    ) {
        super(chatRoomRepository.target, chatRoomRepository.manager, chatRoomRepository.queryRunner);
    }
  async createChatRoom(name: string, type: string, participants: User[]): Promise<ChatRoom> {
    const chatRoom = this.create({ name, type, participants });
    return await this.save(chatRoom);
  }

  async updateChatRoom(id: number, updatedData: Partial<ChatRoom>): Promise<ChatRoom> {
    await this.update(id, updatedData);
    return this.findOne({ where: { id }, relations: ['participants'] });
  }

  async findOneWithRelations(id: number): Promise<ChatRoom> {
    const chatRoom = await this.findOne({ where: { id }, relations: ['participants', 'messages'] });
    if (!chatRoom) {
      throw new NotFoundException(`ChatRoom with ID ${id} not found`);
    }
    return chatRoom;
  }
}
