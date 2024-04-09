import { Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { AuthDto } from './dto';
import { Tokens } from './types';
import {
  AlreadyExistException,
  ERROR_MESSAGES,
  NotFoundException,
  UnauthorizedException,
} from 'src/config/error';
import { PrismaService } from 'src/db/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from '../user/entities/user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseInterceptors(CacheInterceptor)
  async signup(dto: AuthDto): Promise<UserDto> {
    const user = await this.createUserIfNotExists(dto);
    return user;
  }

  async getAll() {
    return this.prisma.user.findMany({
      include: {
        products: {
          include: {
            user: true,
            images: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllProduct() {
    const products = await this.prisma.product.findMany({
      include: {
        user: true,
        images: true,
      },
    });
    // await this.cacheManager.set('nestjs bata aako', products);
    return products;
  }

  async login(dto: Partial<AuthDto>) {
    const user = await this.findUserByEmail(dto.email);
    this.validateUser(user);
    this.validatePassword(dto.password, user.password);
    return this.getTokens(user);
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.findUserById(userId);
    this.validateUser(user);
    const decodedToken = await this.verifyRefreshToken(rt);
    this.validateRefreshToken(decodedToken, user.id);
    return this.getTokens(user);
  }

  private async createUserIfNotExists(dto: AuthDto) {
    const existingUser = await this.findUserByEmail(dto.email);
    if (existingUser) {
      throw new AlreadyExistException(ERROR_MESSAGES.USER_EXISTS);
    }
    const hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { email: dto.email, username: dto.username, password: hash },
    });
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  private validateUser(user: User | null): void {
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
  }

  private validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): void {
    const passwordMatches = bcrypt.compare(inputPassword, storedPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException(ERROR_MESSAGES.INCORRECT_PASSWORD);
    }
  }

  private async findUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.config.get<string>('JWT_SECRET'));
    } catch (error) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.INVALID_OR_EXPIRED_REFRESH_TOKEN,
      );
    }
  }

  private validateRefreshToken(decodedToken: any, userId: number): void {
    if (decodedToken?.id !== userId) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }

  private async getTokens(user: User): Promise<Tokens> {
    const accessToken = await this.signToken(
      user,
      this.config.get('ACCESS_TOKEN_EXPIRES'),
    );
    const refreshToken = await this.signToken(
      user,
      this.config.get('REFRESH_TOKEN_EXPIRES'),
    );
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async signToken(user: User, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(user, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn,
    });
  }
}
