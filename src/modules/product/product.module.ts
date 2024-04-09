import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
// import { CacheModule } from '@nestjs/cache-manager';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
