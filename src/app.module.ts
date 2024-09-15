
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptionsFactory } from './config/database.config';
import { OrganizationModule } from './organizations/organization.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Load environment variables globally
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dataSourceOptionsFactory,
    }),
    AuthModule,
    OrganizationModule,
    UserModule,
    
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)  // Apply the middleware
      .forRoutes('*');  // Apply to all routes
  }
}