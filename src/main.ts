import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.enableCors();
  const port = process.env.PORT || 8080;
  app.useLogger(logger);
  await app.listen(port);
}
bootstrap();
