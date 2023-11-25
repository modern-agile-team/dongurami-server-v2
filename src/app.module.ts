import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiModule } from '@src/apis/api.module';
import { CoreModule } from '@src/core/core.module';
import { LibsModule } from '@src/libs/libs.module';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';

@Module({
  imports: [ApiModule, CoreModule, LibsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
