import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Payload } from '@src/apis/auth/type/auth.type';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UsersService } from '@src/apis/users/services/users.service';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpUnauthorizedException } from '@src/http-exceptions/exceptions/http-unauthorized.exception';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.get<string>(ENV_KEY.JWT_SECRET),
    });
  }

  async validate(payload: Payload): Promise<UserDto> {
    const existUser = await this.usersService.findOneById(payload.id);

    if (!existUser) {
      throw new HttpUnauthorizedException({
        code: COMMON_ERROR_CODE.INVALID_TOKEN,
      });
    }

    return existUser;
  }
}
