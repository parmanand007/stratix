// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: configService.get<string>('DB_HOST'),
//   port: configService.get<number>('DB_PORT'),
//   username: configService.get<string>('DB_USERNAME'),
//   password: configService.get<string>('DB_PASSWORD'),
//   database: configService.get<string>('DB_NAME'),
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   synchronize: false, // Turn off in production
// });

import { ConfigService } from '@nestjs/config';
import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptionsFactory = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT'), 10) ?? 5432,
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
  // logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],  // Adjust the path if needed
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],  // Adjust the path if needed
  migrationsRun: true,
});

const dataSource = new DataSource(dataSourceOptionsFactory(new ConfigService()));

export default dataSource;
