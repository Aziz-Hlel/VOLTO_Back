import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';


const globalPrefix = 'api';

const gloabalValidationPipe = new ValidationPipe({
  whitelist: true, // strips unknown properties
  forbidNonWhitelisted: true, // throws if extra fields are passed
  transform: true, // transforms payloads to DTO classes
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  
  const PORT = configService.get<number>('PORT') || 3000;

  app.useGlobalPipes(gloabalValidationPipe);

  app.setGlobalPrefix(globalPrefix);

  await app.listen(PORT);

  console.log(`Server running on http://localhost:${PORT}/${globalPrefix}/`);

}

bootstrap();
