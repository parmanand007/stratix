import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for the product

  @Column()
  name: string; // Name of the product

  @Column({ unique: true })
  slug: string; // URL-friendly identifier for the product

  @Column('text')
  description: string; // Detailed description of the product

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Price of the product

  @Column({ type: 'enum', enum: ['new', 'used'] })
  condition: 'new' | 'used'; // Condition of the product

  @Column({ nullable: true })
  imageUrl: string; // URL of the product image

  @Column({ default: true })
  isActive: boolean; // Indicates if the product is available for sale

  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: 'userId' })
  user: User; // The user (student) who owns the product

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category; // The category of the product

  @ManyToOne(() => Organization, organization => organization.products)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization; // The organization to which the product belongs

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp for when the product was created

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // Timestamp for when the product was last updated
}
