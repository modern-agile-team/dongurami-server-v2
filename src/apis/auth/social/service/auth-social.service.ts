import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/apis/users/services/users.service';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { AuthService } from '../../services/auth.service';
import { getSnsProfile } from '../../util/getSnsProfile';
import {
  SignInRequestBodyDto,
  SignUpRequestBodyDto,
} from '../dto/auth-social.dto';
import { AuthRegistrationService } from './auth-registration.service';

@Injectable()
export class AuthSocialService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly authRegistrationService: AuthRegistrationService,
  ) {}

  /**
   * @todo 소셜 회원가입 전용 DTO 생성 후 적용
   */
  async signUp(signUpRequestBodyDto: SignUpRequestBodyDto) {
    const { loginType, snsToken } = signUpRequestBodyDto;
    
    const snsProfile = await getSnsProfile(loginType, snsToken);
	if (!snsProfile.snsId) {
	  throw new HttpInternalServerErrorException({
	    code: COMMON_ERROR_CODE.SERVER_ERROR,
	    ctx: '소셜 프로필 조회 중 알 수 없는 에러',
	  });
	}
    
    const user = await this.usersService.create({
      loginType,
      snsId: snsProfile.snsId,
    });

    return user;
  }

  async signIn(signInRequestBodyDto: SignInRequestBodyDto) {
    const { loginType, snsToken } = signInRequestBodyDto;

    const snsProfile = await getSnsProfile(loginType, snsToken);

    if (!snsProfile.snsId) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '소셜 프로필 조회 중 알 수 없는 에러',
      });
    }

    const existUser = await this.usersService.findOneBy({
      loginType,
      snsId: snsProfile.snsId,
    });

    if (!existUser) {
      throw new HttpBadRequestException({
        code: AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND,
      });
    }

    const accessToken = this.authService.generateToken({ id: existUser.id });
    return { accessToken };
  }
}
