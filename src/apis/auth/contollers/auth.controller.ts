import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
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
  @Get('profile')
  getProfile(@User() user: UserDto) {
    return new UserDto(user);
  }

  @Get('access-token/:userId')
  getAccessToken(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.authService.generateToken({ id: userId });
  }
}
