import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateChatMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  @IsNotEmpty()
  senderId: number; // Sender's ID must be provided
}
