import { Organization } from 'src/organizations/entities/organization.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert, Generated } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email'])
@Unique(['uuid'])
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Changed to number

  @Column()
  name: string;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid') 
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true})
  password: string;  // Store hashed passwords here

  @ManyToOne(() => Organization, organization => organization.users)
  @JoinColumn({ name: 'organizationId' }) // Connect with the integer id of the Organization table
  organizationEntity: Organization;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
