import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreeBoard } from '@src/apis/free-boards/controllers/free-board.swagger';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { plainToInstance } from 'class-transformer';
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

  @SetResponse({ type: ResponseType.Pagination, key: 'freeBoards' })
  @Get()
  async findAllAndCount(
    @Query() findFreeBoardListQueryDto: FindFreeBoardListQueryDto,
  ): Promise<[FreeBoardDto[], number]> {
    const [freeBoards, count] = await this.freeBoardService.findAllAndCount(
      findFreeBoardListQueryDto,
    );

    return [plainToInstance(FreeBoardDto, freeBoards), count];
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
