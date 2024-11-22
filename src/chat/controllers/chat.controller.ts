// chat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatRoomDto } from '../dto/create-chat-room.dto';
import { UpdateChatRoomDto } from '../dto/update-chat-room.dto';
import { ChatRoom } from '../entities/chat.entity';
import { ChatService } from '../services/chat.service';

@Controller('chat/room')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    return this.chatService.createChatRoom(createChatRoomDto);
  }

  @Get()
  async findAll(): Promise<ChatRoom[]> {
    return  this.chatService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ChatRoom> {
    const chatRoom = await this.chatService.findOne(id);
    if (!chatRoom) {
      throw new NotFoundException(`ChatRoom with ID ${id} not found`);
    }
    return chatRoom;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
  ): Promise<ChatRoom> {
    return this.chatService.update(id, updateChatRoomDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.chatService.remove(id);
  }
}
