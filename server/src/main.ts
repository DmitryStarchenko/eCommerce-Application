import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:5174',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(3000);
  logger.log('Server running on http://localhost:3000');
}
void bootstrap();
