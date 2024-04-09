import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { ERROR_MESSAGES, UnauthorizedException } from 'src/config/error';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const authHeader = request.headers.authorization;
          if (!authHeader) {
            throw new UnauthorizedException(
              ERROR_MESSAGES.BEARER_TOKEN_MISSING,
            );
          }
          const token = this.extractTokenFromHeader(authHeader);
          if (!token) {
            throw new UnauthorizedException(
              ERROR_MESSAGES.BEARER_TOKEN_MISSING,
            );
          }
          return token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  private extractTokenFromHeader(authHeader: string): string | null {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    throw new UnauthorizedException(ERROR_MESSAGES.INVALID_AUTH_HEADER_FORMAT);
  }

  validate(payload: any) {
    return payload;
  }
}
