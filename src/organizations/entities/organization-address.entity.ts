import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class OrganizationAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column({ default: 'INDIA' })
  country: string;

  @OneToOne(() => Organization, organization => organization.address)
  organization: Organization;
}
