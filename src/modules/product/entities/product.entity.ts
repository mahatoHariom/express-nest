import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/modules/user/entities/user.entity';

export class ProductDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  category: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  @IsOptional()
  userId: number;
  @ApiProperty({ type: () => UserDto })
  @IsOptional()
  user?: UserDto;
  @ApiProperty()
  discountPrice?: number;
  @ApiProperty()
  originalPrice: number;
  @ApiProperty()
  soldOut: number;
  @ApiProperty()
  stock: number;
  @ApiProperty({
    type: () => [ImageDto],
  })
  @IsOptional()
  images?: ImageDto[];
}

class ImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  public_id: string;

  @ApiProperty()
  imgSrc: string;

  @ApiProperty()
  productId: number;

  @ApiProperty({ type: () => ProductDto })
  product: ProductDto;
}
