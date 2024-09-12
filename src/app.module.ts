// // src/app.module.ts
// import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { dataSourceOptions } from './config/database.config';
// import { OrganizationModule } from './organization/organization.module';
// import { LoggerMiddleware } from './middleware/logger.middleware';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),  // Load environment variables globally
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: dataSourceOptions,
//     }),
//     OrganizationModule,
//   ],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(LoggerMiddleware)  // Apply the middleware
//       .forRoutes('*');  // Apply to all routes
//   }
// }



import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptionsFactory } from './config/database.config';
import { OrganizationModule } from './organization/organization.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Load environment variables globally
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dataSourceOptionsFactory,
    }),
    OrganizationModule,
    UserModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)  // Apply the middleware
      .forRoutes('*');  // Apply to all routes
  }
}