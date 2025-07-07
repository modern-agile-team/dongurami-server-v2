import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from '@src/apis/auth/auth.module';
import { DevController } from '@src/apis/dev/controllers/dev.controller';
import { DevService } from '@src/apis/dev/services/dev.service';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';

@Module({
  imports: [AuthModule],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseDevelopmentMiddleware).forRoutes(DevController);
  }
}
