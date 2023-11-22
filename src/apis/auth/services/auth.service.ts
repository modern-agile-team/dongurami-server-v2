import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '@src/apis/auth/type/auth.type';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  generateToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      secret: this.appConfigService.get<string>(ENV_KEY.JWT_SECRET),
    });
  }
}
