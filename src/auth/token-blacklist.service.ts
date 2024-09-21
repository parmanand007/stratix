import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'blacklisted';
  }

  async addTokenToBlacklist(token: string, expiryInSeconds: number): Promise<void> {
    await this.redisClient.set(token, 'blacklisted', 'EX', expiryInSeconds);
  }
}
