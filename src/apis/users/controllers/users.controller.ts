import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiUsers } from '@src/apis/users/controllers/users.swagger';
import { CreateUserDto } from '@src/apis/users/dto/create-user.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UsersService } from '@src/apis/users/services/users.service';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { PutUpdateUserDto } from '../dto/put-update-user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';

@ApiTags('user')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiUsers.Create({ summary: '유저 생성(회원가입)' })
  @SetResponse({ type: ResponseType.Detail, key: 'user' })
  @Post()
  create(
    @Body() createUserRequestBodyDto: CreateUserDto,
  ): DetailResponse<UserDto> {
    return this.usersService.create(createUserRequestBodyDto);
  }

  @ApiUsers.FindOneUserOrNotFound({ summary: '유저 정보 단일 조회' })
  @SetResponse({ type: ResponseType.Detail, key: 'user' })
  @Get(':userId')
  findOneUserOrNotFound(
    @Param('userId', ParsePositiveIntPipe) userId: number,
  ): DetailResponse<UserDto> {
    return this.usersService.findOneUserOrNotFound(userId);
  }

  @ApiUsers.PutUpdate({ summary: '유저 정보 업데이트' })
  @SetResponse({ type: ResponseType.Detail, key: 'user' })
  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  putUpdate(
    @User() user: UserDto,
    @Param('userId', ParsePositiveIntPipe) userId: number,
    @Body() putUpdateUserDto: PutUpdateUserDto,
  ) {
    return this.usersService.putUpdate(user.id, userId, putUpdateUserDto);
  }
}
