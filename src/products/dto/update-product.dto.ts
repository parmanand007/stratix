// src/products/dto/update-product.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 1, required: false })
  userId?: number;

  @ApiProperty({ example: 1, required: false })
  categoryId?: number;

  @ApiProperty({ example: 1, required: false })
  organizationId?: number;
}
