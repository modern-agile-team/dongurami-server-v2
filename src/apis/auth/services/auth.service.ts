import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { Payload } from '@src/apis/auth/type/auth.type';
import { UsersService } from '@src/apis/users/services/users.service';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signIn(signInRequestBodyDto: SignInRequestBodyDto) {
    const existUser = await this.usersService.findOneBy({
      loginType: signInRequestBodyDto.loginType,
      email: signInRequestBodyDto.email,
    });

    if (!existUser) {
      throw new HttpBadRequestException({
        code: AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND,
      });
    }

    const accessToken = this.generateToken({ id: existUser.id });

    return {
      accessToken,
    };
  }

  generateToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      secret: this.appConfigService.get<string>(ENV_KEY.JWT_SECRET),
    });
  }
}
