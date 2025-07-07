import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@src/apis/auth/controllers/auth.controller';
import { JwtModuleOptionsFactory } from '@src/apis/auth/jwt/jwt-module-options.factory';
import { JwtStrategy } from '@src/apis/auth/jwt/jwt.strategy';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UsersModule } from '@src/apis/users/users.module';
import { EncryptionModule } from '@src/libs/encryption/encryption.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    EncryptionModule,
    JwtModule.registerAsync({
      useClass: JwtModuleOptionsFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModuleOptionsFactory, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
