import { Organization } from 'src/organizations/entities/organization.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
// import {}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  // Define a column for the foreign key with UUID type
  @Column({ type: 'uuid' })
  organizationId: string;

  // Define the many-to-one relationship
  @ManyToOne(() => Organization, organization => organization.users)
  @JoinColumn({ name: 'organizationId' })
  organizationEntity: Organization;
}
