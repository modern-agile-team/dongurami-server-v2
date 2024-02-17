import { Module } from '@nestjs/common';

import { AuthModule } from '@src/apis/auth/auth.module';
import { AuthSocialController } from '@src/apis/auth/social/controllers/auth-social.controller';
import { AuthRegistrationService } from '@src/apis/auth/social/service/auth-registration.service';
import { AuthSocialService } from '@src/apis/auth/social/service/auth-social.service';
import { UsersModule } from '@src/apis/users/users.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AuthSocialController],
  providers: [AuthSocialService, AuthRegistrationService],
  exports: [AuthSocialService],
})
export class AuthSocialModule {}
