import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the validation pipe globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // Automatically remove properties that do not have any decorators
    forbidNonWhitelisted: true, // Throw an error if there are non-whitelisted properties
    transform: true,   // Automatically transform payloads to DTO types
  }));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  // Use the ClassSerializerInterceptor globally
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll', // Exclude all properties by default
      excludeExtraneousValues: true, // Exclude values not marked with @Expose()
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });
  

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
