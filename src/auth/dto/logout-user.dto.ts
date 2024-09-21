import { IsString } from 'class-validator';

export class LogoutUserDto {
  @IsString()
  readonly token: string;
}
