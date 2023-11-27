import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { Payload } from '@src/apis/auth/type/auth.type';
import { UsersService } from '@src/apis/users/services/users.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
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
      throw new BadRequestException('Different account information');
    }

    /**
     * @todo 로그인타입 늘어남에 따라 변경 대상
     * 현재 email 로그인만 있기에 password 가 없으면 서버에러로 간주한다.
     */
    if (!existUser.password) {
      throw new InternalServerErrorException('server error');
    }

    const isComparePassword = await this.encryptionService.compare(
      signInRequestBodyDto.password,
      existUser.password,
    );

    if (!isComparePassword) {
      throw new BadRequestException('Different account information');
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
