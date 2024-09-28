import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentId } });
      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID ${createCategoryDto.parentId} not found`);
      }
      category.parent = parentCategory;
    }
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['parent', 'children', 'products'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['parent', 'children', 'products'] });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });
      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
      }
      category.parent = parentCategory;
    }
    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
