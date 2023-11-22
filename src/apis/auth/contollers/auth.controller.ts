import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/common/get-request.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
