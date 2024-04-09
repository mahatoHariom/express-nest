import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getAllProduct() {
    const products = await this.prisma.product.findMany({
      include: {
        user: true,
        images: true,
      },
    });

    return products;
  }
}
