import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Generated } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number; // Integer ID

  @Column()
  name: string;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid') 
  uuid: string;

  @Column({ unique: true })
  domain: string; // This represents the domain for the organization

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => User, user => user.organizationEntity)
  users: User[];

  @OneToMany(() => Product, product => product.organization)
  products: Product[];
}
