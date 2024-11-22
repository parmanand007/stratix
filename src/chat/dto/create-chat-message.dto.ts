import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatMessageDto {
  @ApiProperty({
    description: 'Content of the chat message',
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID of the chat room where the message will be sent',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  chatRoomId: number;

  @ApiProperty({
    description: 'ID of the user sending the message',
    example: 42,
  })
  @IsInt()
  @IsNotEmpty()
  senderId: number;
}
