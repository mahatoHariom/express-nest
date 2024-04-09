import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
// import { JwtPayload } from '../types';
import { ERROR_MESSAGES, NotFoundException } from 'src/config/error';
import { User } from '@prisma/client';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: User) {
    const refreshToken = req?.cookies?.refresh_token;
    if (!refreshToken) {
      throw new NotFoundException(ERROR_MESSAGES.MISSING_REFRESH_TOKEN);
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
