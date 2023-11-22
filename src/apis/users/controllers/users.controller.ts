import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UsersService } from '@src/apis/users/services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserRequestBodyDto: CreateUserRequestBodyDto) {
    return this.usersService.create(createUserRequestBodyDto);
  }
}
