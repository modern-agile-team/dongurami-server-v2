import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAuth } from '@src/apis/auth/controllers/auth.swagger';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';

@ApiTags('auth')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @todo 현재 email 만 구성
   */
  @ApiAuth.SignIn({ summary: '로그인' })
  @Post('sign-in')
  signIn(@Body() signInRequestBodyDto: SignInRequestBodyDto) {
    return this.authService.signIn(signInRequestBodyDto);
  }

  @ApiAuth.GetProfile({ summary: '로그인한 유저 정보 조회' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'user', type: ResponseType.Detail })
  @Get('profile')
  getProfile(@User() user: UserDto): DetailResponse<UserDto> {
    return new UserDto(user);
  }
}
