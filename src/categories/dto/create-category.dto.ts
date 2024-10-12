import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Slug for the category (URL-friendly)' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Rich description of the category', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID of the parent category', required: false })
  @IsOptional()
  parentId?: number;
}
