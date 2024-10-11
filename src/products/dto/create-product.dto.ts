import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Electric Kettle' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'kettle' })
    @IsString()
    slug: string;

    @ApiProperty({ example: 'Original Electric Kettle' })
    @IsString()
    description: string;

    @ApiProperty({ example: 550.00 })
    @IsNumber()
    price: number;

    @ApiProperty({ enum: ['new', 'used'], example: 'used' })
    @IsEnum(['new', 'used'])
    condition: 'new' | 'used';

    @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @ApiProperty({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({ example: 1 })
    @IsNumber()
    userId: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    organizationId: number;

    @ApiProperty({ example: 1 })
    @IsNumber()
    categoryId: number;
}
