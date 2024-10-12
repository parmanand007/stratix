import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for the category

  @Column()
  name: string; // Name of the category

  @Column({ unique: true })
  slug: string; // Slug for the category (URL-friendly)

  @Column('text', { nullable: true })
  description: string; // Rich description of the category

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  parent: Category; // Optional parent category for hierarchical structure

  @OneToMany(() => Category, category => category.parent)
  children: Category[]; // Subcategories

  @OneToMany(() => Product, product => product.category)
  products: Product[]; // Products belonging to this category

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp for when the product was created
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // Timestamp for when the category was last updated
}
