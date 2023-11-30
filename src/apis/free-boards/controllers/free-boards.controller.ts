import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreeBoard } from '@src/apis/free-boards/controllers/free-board.swagger';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';
import { FreeBoardsService } from '../services/free-board.service';

@ApiTags('free-boards')
@Controller('free-boards')
export class FreeBoardsController {
  constructor(private readonly freeBoardService: FreeBoardsService) {}

  @ApiFreeBoard.Create({ summary: '자유 게시글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freeBoard', type: ResponseType.Detail })
  @Post()
  create(
    @User() user: UserDto,
    @Body() createFreeBoardDto: CreateFreeBoardDto,
  ) {
    return this.freeBoardService.create(user.id, createFreeBoardDto);
  }

  @Get()
  findAllAndCount() {
    return this.freeBoardService.findAllAndCount();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.freeBoardService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFreeBoardDto: UpdateFreeBoardDto,
  // ) {
  //   return this.freeBoardService.update(+id, updateFreeBoardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.freeBoardService.remove(+id);
  // }
}
