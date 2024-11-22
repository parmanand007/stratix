// src/modules/chats/chat-message/chat-message.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { UpdateChatMessageDto } from '../dto/update-chat-message.dto';
import { User } from '../../users/entities/user.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { ChatRoom } from '../entities/chat.entity';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // Create a new chat message
  async create(createChatMessageDto: CreateChatMessageDto): Promise<ChatMessage> {
    const { content, chatRoomId, senderId } = createChatMessageDto;

    const chatRoom = await this.chatRoomRepository.findOne({
         where: { id: chatRoomId } ,
         relations: ['participants'],
        });
    const sender = await this.userRepository.findOne({ where: { id: senderId } });

 // If chat room or sender not found, throw a 404 error
    if (!chatRoom) {
        throw new NotFoundException('ChatRoom not found');
    }

    if (!sender) {
        throw new NotFoundException('Sender not found');
    }

    // Check if the user is a participant of the chat room
    const isParticipant = chatRoom.participants.some(participant => participant.id === senderId);

    if (!isParticipant) {
      throw new ForbiddenException('User is not a participant of this chat room');
    }

    const chatMessage = this.chatMessageRepository.create({
      content,
      chatRoom,
      sender,
    });

    return this.chatMessageRepository.save(chatMessage);
  }

  // Get all messages for a specific chat room
  async findAllByChatRoom(chatRoomId: number): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: ['sender', 'chatRoom'],
    });
  }

  // Update a chat message
  async update(
    id: number,
    updateChatMessageDto: UpdateChatMessageDto
  ): Promise<ChatMessage> {
    const { content, senderId } = updateChatMessageDto;
  
    // Find the chat message with its sender
    const chatMessage = await this.chatMessageRepository.findOne({
      where: { id },
      relations: ['sender'], // Include sender relation for ownership validation
    });
  
    if (!chatMessage) {
      throw new Error('Message not found');
    }
  
    // Ensure the authenticated sender is the owner of the message
    if (chatMessage.sender.id !== senderId) {
      throw new ForbiddenException('You are not authorized to update this message');
    }
  
    // Update the message content
    chatMessage.content = content || chatMessage.content;
  
    // Save and return the updated message
    return this.chatMessageRepository.save(chatMessage);
  }

  // Delete a chat message
  async remove(id: number): Promise<void> {
    const chatMessage = await this.chatMessageRepository.findOne({ where: { id } });
    if (!chatMessage) {
      throw new Error('Message not found');
    }

    await this.chatMessageRepository.remove(chatMessage);
  }
}
