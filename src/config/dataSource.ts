import { Organization } from 'src/organization/entities/organization.entity';
import { DataSource } from 'typeorm';
// import { Organization } from '../organization/entities/organization.entity';
// import { User } from '../user/entities/user.entity';
// import { Product } from '../product/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres', // Database type
  host: 'localhost', // Database host
  port: 5432, // Database port
  username: 'your_username', // Database username
  password: 'your_password', // Database password
  database: 'your_database', // Database name
  entities: [Organization], // Paths to your entities
  migrations: [__dirname + '/../migrations/*.{js,ts}'], // Paths to your migration files
  synchronize: false, // Set to false for production; use migrations instead
});