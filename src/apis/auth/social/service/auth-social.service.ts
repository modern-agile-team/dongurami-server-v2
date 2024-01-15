import { Injectable } from "@nestjs/common";
import { SignInRequestBodyDto, SignUpRequestBodyDto } from "../dto/auth-social.dto";
import { UsersService } from "@src/apis/users/services/users.service";
import { HttpBadRequestException } from "@src/http-exceptions/exceptions/http-bad-request.exception";
import { HttpConflictException } from "@src/http-exceptions/exceptions/http-conflict.exception";
import { USER_ERROR_CODE } from "@src/constants/error/users/user-error-code.constant";
import { getSnsProfile } from "../../util/getSnsProfile";
import { HttpInternalServerErrorException } from "@src/http-exceptions/exceptions/http-internal-server-error.exception";
import { COMMON_ERROR_CODE } from "@src/constants/error/common/common-error-code.constant";
import { AUTH_ERROR_CODE } from "@src/constants/error/auth/auth-error-code.constant";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class AuthSocialService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  async signUp(signUpRequestBodyDto: SignUpRequestBodyDto) {
    const {
      loginType,
      snsToken,
      email,
      phoneNumber,
    } = signUpRequestBodyDto;
    
    const snsProfile = await getSnsProfile(loginType, snsToken);
    if (!snsProfile.sns_id) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '소셜 프로필 조회 중 알 수 없는 에러',
      });
    }

    const existUser = await this.usersService.findOneBy({
      loginType,
      email: email,
      phoneNumber: phoneNumber,
    });

    if (existUser) {
      if (existUser.email.toLowerCase() === email.toLowerCase()) {
        throw new HttpConflictException({
          code: USER_ERROR_CODE.ALREADY_EXIST_USER_EMAIL,
        });
      }
      if (existUser.phoneNumber === phoneNumber) {
        throw new HttpConflictException({
          code: USER_ERROR_CODE.ALREADY_EXIST_USER_PHONE_NUMBER,
        });
      }
    }
    
    const user = this.usersService.create({
        ...signUpRequestBodyDto,
        snsId: snsProfile.sns_id,
        password: null
    })

    return user;
  }

  async signIn(signInRequestBodyDto: SignInRequestBodyDto) {
    const { loginType, snsToken } = signInRequestBodyDto;

    const snsProfile = await getSnsProfile(loginType, snsToken);

    if (!snsProfile.sns_id) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '소셜 프로필 조회 중 알 수 없는 에러',
      });
    }

    const existUser = await this.usersService.findOneBy({
      loginType,
      snsId: snsProfile.sns_id
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