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
