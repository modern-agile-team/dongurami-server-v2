import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApiModule } from '@src/apis/api.module';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { CoreModule } from '@src/core/core.module';
import { HttpExceptionModule } from '@src/http-exceptions/http-exception.module';
import { InterceptorModule } from '@src/interceptors/interceptor.module';
import { LibsModule } from '@src/libs/libs.module';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';

@Module({
  imports: [
    ApiModule,
    CoreModule,
    LibsModule,
    InterceptorModule,
    HttpExceptionModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseDevelopmentMiddleware).forRoutes({
      path: 'error-code',
      method: RequestMethod.GET,
    });
  }
}
