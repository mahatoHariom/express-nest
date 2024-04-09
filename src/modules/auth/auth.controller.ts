import {
  Body,
  ClassSerializerInterceptor,
  // ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';
import { Tokens } from './types';

import { AtGuard, RtGuard } from './guards';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { UserDto } from '../user/entities/user.entity';
// import { SerializeInterceptor } from 'src/common/serializerInterceptor';

@ApiTags('Auth Routes')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({
    description: 'Register a new user',
    operationId: 'Register',
    summary: 'Create or register new  User',
  })
  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({
    description: 'User Registration',
    type: UserDto,
  })
  async signup(@Body() dto: AuthDto): Promise<UserDto> {
    const user = await this.authService.signup(dto);
    return new UserDto(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Login Success', type: Tokens })
  @ApiOperation({
    description: 'Login user',
    operationId: 'Login',
    summary: 'Login User',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    const tokens: Tokens = await this.authService.login(dto);
    this.setRefreshTokenCookie(response, tokens.refresh_token);
    return tokens;
  }

  @ApiBearerAuth()
  @UseGuards(AtGuard, RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiCreatedResponse({ description: 'Refresh Token' })
  async refreshTokens(
    @GetCurrentUser() user: UserDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const refreshToken: string = request?.cookies?.refresh_token;
    const tokens: Tokens = await this.authService.refreshTokens(
      user?.id,
      refreshToken,
    );
    this.setRefreshTokenCookie(response, tokens.refresh_token);
    return tokens;
  }

  @Public()
  @Get('getAll')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'Get all users',
    type: UserDto,
    isArray: true,
  })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.authService.getAll();
    return users.map((user) => new UserDto(user));
  }

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie('refresh_token', refreshToken);
  }
}
