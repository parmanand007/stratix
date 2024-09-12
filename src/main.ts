import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the validation pipe globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // Automatically remove properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw an error if there are non-whitelisted properties
    transform: true,   // Automatically transform payloads to DTO types
  }));

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
