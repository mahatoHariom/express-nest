import { HttpException, HttpStatus } from '@nestjs/common';

// message
export const ERROR_MESSAGES = {
  AUTHORIZATION_HEADER_MISSING: 'AUTHORIZATION_HEADER_MISSING',
  BEARER_TOKEN_MISSING: 'BEARER_TOKEN_MISSING',
  INVALID_AUTH_HEADER_FORMAT: 'INVALID_AUTH_HEADER_FORMAT',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_MALFORMED: 'REFRESH_TOKEN_MALFORMED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
  USER_EXISTS: 'USER_EXISTS',
  INVALID_OR_EXPIRED_REFRESH_TOKEN: 'INVALID_OR_EXPIRED_REFRESH_TOKEN',
  MISSING_REFRESH_TOKEN: 'MISSING_REFRESH_TOKEN',
};

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class AlreadyExistException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
