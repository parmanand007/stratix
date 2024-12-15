import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ChatMessageService } from './services/chat-message.service';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatMessageService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: CreateChatMessageDto) {
    try {
      console.log('Message received:', payload);

      // Call the service to create and save the message
      const savedMessage = await this.chatService.create(payload);

      // Broadcast the saved message to all participants in the chat room
      // TODO  use messaging queue or caching mechanism
      this.server.to(`room-${payload.chatRoomId}`).emit('message', {
        id: savedMessage.id,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
        chatRoomId: payload.chatRoomId,
        senderId: payload.senderId,
      });

      // Optionally acknowledge to the sender
      client.emit('messageAck', { status: 'success', data: savedMessage });
    } catch (error) {
      console.error('Error handling message:', error.message);

      // Send error response back to the sender
      client.emit('error', {
        status: 'error',
        message: error.message || 'Failed to send message',
      });
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { chatRoomId: number, SenderId:number }) {
    const room = `room-${payload.chatRoomId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);

    // Notify other participants in the room
    client.to(room).emit('userJoined', { message: `User ${payload.SenderId} joined the room ${payload.chatRoomId}` });
  }
}
