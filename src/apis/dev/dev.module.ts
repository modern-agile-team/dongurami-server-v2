import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AuthModule } from '@src/apis/auth/auth.module';
import { DevController } from '@src/apis/dev/controllers/dev.controller';
import { RootModule } from '@src/apis/root/root.module';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';

@Module({
  imports: [AuthModule, RootModule],
  controllers: [DevController],
})
export class DevModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseDevelopmentMiddleware).forRoutes(
      {
        path: 'dev/access-token/:userId',
        method: RequestMethod.GET,
      },
      {
        path: 'dev/error-code',
        method: RequestMethod.GET,
      },
    );
  }
}
