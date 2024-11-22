import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Put, 
    Delete, 
    Request
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
  import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
  import { UpdateChatMessageDto } from '../dto/update-chat-message.dto';
  import { ChatMessage } from '../entities/chat-message.entity';
  import { ChatMessageService } from '../services/chat-message.service';
  
  @ApiTags('Chat Messages') // Tag for grouping in Swagger
  @Controller('chat/messages')
  export class ChatMessageController {
    constructor(private readonly chatMessageService: ChatMessageService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new chat message' })
    @ApiResponse({ status: 201, description: 'The chat message has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiBody({ type: CreateChatMessageDto })
    async create(
      @Body() createChatMessageDto: CreateChatMessageDto
    ): Promise<ChatMessage> {
      return this.chatMessageService.create(createChatMessageDto);
    }
  
    @Get(':chatRoomId')
    @ApiOperation({ summary: 'Get all messages for a specific chat room' })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully.', type: [ChatMessage] })
    @ApiResponse({ status: 404, description: 'Chat room not found.' })
    @ApiParam({ name: 'chatRoomId', type: 'number', description: 'ID of the chat room' })
    async findAll(@Param('chatRoomId') chatRoomId: number): Promise<ChatMessage[]> {
      return this.chatMessageService.findAllByChatRoom(chatRoomId);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a chat message' })
    @ApiResponse({ status: 200, description: 'Chat message updated successfully.' })
    @ApiResponse({ status: 404, description: 'Chat message not found.' })
    @ApiBody({ type: UpdateChatMessageDto })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the chat message' })
    
    async update(
      @Param('id') id: number,
      @Body() updateChatMessageDto: UpdateChatMessageDto,
    ): Promise<ChatMessage> {
      return this.chatMessageService.update(id, updateChatMessageDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a chat message' })
    @ApiResponse({ status: 204, description: 'Chat message deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Chat message not found.' })
    @ApiParam({ name: 'id', type: 'number', description: 'ID of the chat message' })
    async remove(@Param('id') id: number): Promise<void> {
      return this.chatMessageService.remove(id);
    }
  }
  