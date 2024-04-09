import { $Enums } from '@prisma/client';
import { Product } from 'src/modules/product/types';


export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  password: string;
  role: $Enums.Role;
  products?: Product[];
}
