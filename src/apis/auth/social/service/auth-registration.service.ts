import { Injectable } from "@nestjs/common";
import { UsersService } from "@src/apis/users/services/users.service";
import { getSnsProfile } from "../../util/getSnsProfile";
import { CheckRegistrationRequestBodyDto } from "../dto/auth-registration.dto";

@Injectable()
export class AuthRegistrationService {
  constructor(private readonly usersService: UsersService) { }

  async isUserRegistered(checkRegistrationRequestBodyDto: CheckRegistrationRequestBodyDto): Promise<boolean> {
    const { loginType, snsToken } = checkRegistrationRequestBodyDto;
    const snsProfile = await getSnsProfile(loginType, snsToken);

    if (snsProfile) {
      const user = await this.usersService.findOneBy({
        loginType: checkRegistrationRequestBodyDto.loginType,
        snsId: snsProfile.snsId
      });

      return !!user;
    }

    return false;
  }
}
