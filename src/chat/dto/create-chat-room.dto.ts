// dto/create-chat-room.dto.ts
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  type?: string; // Defaults to 'private' if not provided

  @IsArray()
  @IsOptional()
  participants?: number[]; // Array of user IDs to add to the chat room
}
