// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const user = await this.userRepository.findOne({ 
      where: { id: createProductDto.userId },
      relations: ['organizationEntity'] // Load the organization relation
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createProductDto.userId} not found`);
    }

    const organization = await this.organizationRepository.findOne({ where: { id: createProductDto.organizationId } });
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${createProductDto.organizationId} not found`);
    }
    if (user.organizationEntity.id != organization.id) {
      throw new NotFoundException(`Organization with ID ${createProductDto.organizationId} not attached to user`);
    }

    const category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      user,
      organization,
      category,
    });

    return await this.productRepository.save(product);
  }

  
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['user', 'organization', 'category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['user', 'organization', 'category'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Validate related entities if necessary
    if (updateProductDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateProductDto.userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${updateProductDto.userId} not found`);
      }
      product.user = user;
    }

    if (updateProductDto.organizationId) {
      const organization = await this.organizationRepository.findOne({ where: { id: updateProductDto.organizationId } });
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${updateProductDto.organizationId} not found`);
      }
      product.organization = organization;
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
      }
      product.category = category;
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
