import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtModuleOptionsFactory } from '@src/apis/auth/jwt/jwt-module-options.factory';
import { JwtStrategy } from '@src/apis/auth/jwt/jwt.strategy';
import { UsersModule } from '@src/apis/users/users.module';
import { UseDevelopmentMiddleware } from '@src/middlewares/use-development.middleware';
import { AuthController } from './contollers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtModuleOptionsFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModuleOptionsFactory, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseDevelopmentMiddleware).forRoutes({
      path: 'auth/access-token/:userId',
      method: RequestMethod.GET,
    });
  }
}
