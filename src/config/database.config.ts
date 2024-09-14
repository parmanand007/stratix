import { ConfigService } from '@nestjs/config';
import { DataSourceOptions, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export const dataSourceOptionsFactory = (configService: ConfigService): DataSourceOptions => {
  // Read SSL certificates paths from ConfigService
  const sslCaPath = configService.get<string>('SSL_CA_CERTIFICATES');
  
  // Determine the environment
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  const ssl = sslCaPath && isProduction ? {
    ca: fs.readFileSync(path.resolve('./src/assets/ca.crt')),
    
  } : undefined;

  // Set migration paths based on environment
  const migrations = isProduction 
    ? [__dirname + '/../migrations/production/*{.ts,.js}']
    : [__dirname + '/../migrations/*{.ts,.js}'];
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST') ,
    port: parseInt(configService.get<string>('DB_PORT'), 10) ?? 5432,
    username: configService.get<string>('DB_USERNAME') ,
    password: configService.get<string>('DB_PASSWORD') ,
    database: configService.get<string>('DB_NAME') ,
    synchronize: false,
    // logging: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],  // Adjust the path if needed
    migrations,
    migrationsRun: true,
    ssl,  // Add the SSL configuration
  };
};

const configService = new ConfigService();
const dataSource = new DataSource(dataSourceOptionsFactory(configService));

export default dataSource;
