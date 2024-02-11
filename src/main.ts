import { NestFactory } from '@nestjs/core';
import { AppService } from '@src/app.service';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AppModule } from './app.module';

async function bootstrap() {
  initializeTransactionalContext({
    storageDriver: StorageDriver.AUTO,
  });

  const app = await NestFactory.create(AppModule);
  const appService = app.get<AppService>(AppService);

  appService.setCors(app);
  appService.setLogger(app);
  appService.setPathPrefix(app);
  appService.setInterceptor(app);
  appService.setPipe(app);
  appService.setFilter(app);
  appService.setSwagger(app);

  await appService.startingServer(app);
}
bootstrap();
