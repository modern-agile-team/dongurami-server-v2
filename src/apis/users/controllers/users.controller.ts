import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiUsers } from '@src/apis/users/controllers/users.swagger';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UsersService } from '@src/apis/users/services/users.service';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiUsers.Create({ summary: '유저 생성(회원가입)' })
  @SetResponse({ type: ResponseType.Detail, key: 'user' })
  @Post()
  create(
    @Body() createUserRequestBodyDto: CreateUserRequestBodyDto,
  ): DetailResponse<UserDto> {
    return this.usersService.create(createUserRequestBodyDto);
  }
}
