import { ConfigService } from '@nestjs/config';
import { DataSourceOptions, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export const dataSourceOptionsFactory = (configService: ConfigService): DataSourceOptions => {
  // Read SSL certificates paths from ConfigService
  const sslCaPath = configService.get<string>('SSL_CA_CERTIFICATES');
  

  const ssl = sslCaPath  ? {
    ca: fs.readFileSync(path.resolve(sslCaPath)),
    
  } : undefined;

   // Log environment variables for debugging purposes
   console.log('DB_HOST:', configService.get<string>('DB_HOST'));
   console.log('DB_PORT:', configService.get<string>('DB_PORT'));
   console.log('DB_USERNAME:', configService.get<string>('DB_USERNAME'));
   console.log('DB_PASSWORD:', configService.get<string>('DB_PASSWORD'));
   console.log('DB_NAME:', configService.get<string>('DB_NAME'));

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
    migrations: [__dirname + '/../migrations/production/*{.ts,.js}'],  // Adjust the path if needed
    // migrations: ['./migrations/*{.ts,.js}','./migrations/production/*{.ts,.js}'],  // Adjust the path if needed
    migrationsRun: true,
    ssl,  // Add the SSL configuration
  };
};

const configService = new ConfigService();
const dataSource = new DataSource(dataSourceOptionsFactory(configService));

export default dataSource;
