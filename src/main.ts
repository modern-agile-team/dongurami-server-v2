import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.enableCors({
    origin: true, // 또는 특정 도메인을 설정
    methods: 'GET ,HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // 이 옵션을 true로 설정하여 쿠키 전송을 허용
  });
  const port = process.env.PORT || 8080;
  app.useLogger(logger);
  await app.listen(port);
}
bootstrap();
