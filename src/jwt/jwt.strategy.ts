import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UserService } from '../users/user.service';
import { TokenBlacklistService } from '../auth/token-blacklist.service'; // Import the TokenBlacklistService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private tokenBlacklistService: TokenBlacklistService, // Inject the TokenBlacklistService
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Check if the token is blacklisted
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload as any);
    const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return this.userService.findById(payload.sub);
  }
}
