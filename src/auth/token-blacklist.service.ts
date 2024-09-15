import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class TokenBlacklistService {
  private readonly redisClient;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  async blacklistToken(token: string, expiration: number): Promise<void> {
    await this.redisClient.set(token, 'blacklisted', 'EX', expiration);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'blacklisted';
  }
}
