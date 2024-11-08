import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatMessage } from './chat-message.entity';


@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Useful for group chat

  @Column({ default: 'private' }) // private for one-on-one, group for multiple users
  type: string;

  @OneToMany(() => ChatMessage, (message) => message.chatRoom)
  messages: ChatMessage[];

  // Many-to-many relationship between ChatRoom and User entities
  @ManyToMany(() => User, (user) => user.chatRooms)
  @JoinTable() // Creates a join table to store chat room participants
  participants: User[];
}