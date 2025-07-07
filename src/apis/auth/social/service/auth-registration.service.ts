import { Injectable } from '@nestjs/common';

import { CheckRegistrationRequestBodyDto } from '@src/apis/auth/social/dto/auth-registration.dto';
import { getSnsProfile } from '@src/apis/auth/util/getSnsProfile';
import { UsersService } from '@src/apis/users/services/users.service';

@Injectable()
export class AuthRegistrationService {
  constructor(private readonly usersService: UsersService) {}

  async isUserRegistered(
    checkRegistrationRequestBodyDto: CheckRegistrationRequestBodyDto,
  ): Promise<boolean> {
    const { loginType, snsToken } = checkRegistrationRequestBodyDto;
    const snsProfile = await getSnsProfile(loginType, snsToken);

    if (snsProfile) {
      const user = await this.usersService.findOneBy({
        loginType: checkRegistrationRequestBodyDto.loginType,
        snsId: snsProfile.snsId,
      });

      return !!user;
    }

    return false;
  }
}
