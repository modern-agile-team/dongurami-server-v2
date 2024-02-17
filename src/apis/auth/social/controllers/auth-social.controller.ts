import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAuthSocial } from '@src/apis/auth/social/controllers/auth-social.swagger';
import { CheckRegistrationRequestBodyDto } from '@src/apis/auth/social/dto/auth-registration.dto';
import {
  SignInRequestBodyDto,
  SignUpRequestBodyDto,
} from '@src/apis/auth/social/dto/auth-social.dto';
import { AuthRegistrationService } from '@src/apis/auth/social/service/auth-registration.service';
import { AuthSocialService } from '@src/apis/auth/social/service/auth-social.service';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';

/**
 * author: changhoon oh
 * @todo https://eslint.org/docs/latest/rules/no-return-await
 */
@ApiTags('auth-social')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('auth/social')
export class AuthSocialController {
  constructor(
    private readonly authSocialService: AuthSocialService,
    private readonly authRegistrationService: AuthRegistrationService,
  ) {}

  @ApiAuthSocial.CheckRegistration({ summary: '소셜 유저 프로필 유무 조회' })
  @Post('check-registration')
  async checkRegistration(
    @Body() checkRegistrationRequestBodyDto: CheckRegistrationRequestBodyDto,
  ): Promise<boolean> {
    return await this.authRegistrationService.isUserRegistered(
      checkRegistrationRequestBodyDto,
    );
  }

  @ApiAuthSocial.SignUp({ summary: '소셜 회원가입' })
  @Post('signup')
  async signUp(@Body() signUpRequestBodyDto: SignUpRequestBodyDto) {
    return await this.authSocialService.signUp(signUpRequestBodyDto);
  }

  @ApiAuthSocial.SignIn({ summary: '소셜 로그인' })
  @Post('signin')
  async signIn(@Body() signInRequestBodyDto: SignInRequestBodyDto) {
    return await this.authSocialService.signIn(signInRequestBodyDto);
  }
}
