import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @todo 현재 email 만 구성
   */
  @Post('sign-in')
  signIn(@Body() signInRequestBodyDto: SignInRequestBodyDto) {
    return this.authService.signIn(signInRequestBodyDto);
  }

  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'user', type: ResponseType.Detail })
  @Get('profile')
  getProfile(@User() user: UserDto): DetailResponse<UserDto> {
    return new UserDto(user);
  }

  @Get('access-token/:userId')
  getAccessToken(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.authService.generateToken({ id: userId });
  }
}
