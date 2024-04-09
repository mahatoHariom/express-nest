import { User } from '@prisma/client';

// import { User } from '@prisma/client';
export type JwtPayload = {
  user: User;
};
