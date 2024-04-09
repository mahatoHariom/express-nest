import { Controller, Get, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ProductDto } from './entities/product.entity';
import { ProductService } from './product.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('Product Routes')
@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: [ProductDto] })
  @Get('all')
  async getAllProduct() {
    const products = await this.productService.getAllProduct();
    return products;
  }
}
