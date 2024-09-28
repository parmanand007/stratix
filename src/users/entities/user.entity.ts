// Import necessary modules and entities
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, 
  Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert, Generated } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Organization } from '../../organizations/entities/organization.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
@Unique(['email'])
@Unique(['uuid'])
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for the user

  @Column()
  name: string; // Name of the user

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid') 
  uuid: string; // UUID for the user

  @Column({ unique: true })
  email: string; // Email of the user

  @Column({ nullable: true })
  password: string; // Password of the user (hashed)

  @ManyToOne(() => Organization, organization => organization.users)
  @JoinColumn({ name: 'organizationId' }) // Connect with the integer id of the Organization table
  organizationEntity: Organization; // Organization to which the user belongs

  @OneToMany(() => Product, product => product.user)
  products: Product[]; // Products owned by the user

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp for when the user was created

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date; // Timestamp for when the user was last updated

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}

