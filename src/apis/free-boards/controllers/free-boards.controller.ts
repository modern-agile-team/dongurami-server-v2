import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreeBoard } from '@src/apis/free-boards/controllers/free-board.swagger';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { FreeBoardsItemDto } from '@src/apis/free-boards/dto/free-boards-item.dto';
import { PutUpdateFreeBoardDto } from '@src/apis/free-boards/dto/put-update-free-board.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
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

  @ApiFreeBoard.FindAllAndCount({ summary: '자유 게시글 전체조회(pagination)' })
  @SetResponse({ type: ResponseType.Pagination, key: 'freeBoards' })
  @Get()
  async findAllAndCount(
    @Query() findFreeBoardListQueryDto: FindFreeBoardListQueryDto,
  ): Promise<[FreeBoardsItemDto[], number]> {
    const [freeBoards, count] = await this.freeBoardService.findAllAndCount(
      findFreeBoardListQueryDto,
    );

    return [plainToInstance(FreeBoardsItemDto, freeBoards), count];
  }

  @ApiFreeBoard.FindOneOrNotFound({ summary: '자유게시글 상세조회' })
  @SetResponse({ type: ResponseType.Detail, key: 'freeBoard' })
  @Get(':freeBoardId')
  findOneOrNotFound(
    @Param('freeBoardId', ParsePositiveIntPipe) freeBoardId: number,
  ): Promise<FreeBoardDto> {
    return this.freeBoardService.findOneOrNotFound(freeBoardId);
  }

  @ApiFreeBoard.PutUpdate({ summary: '자유게시글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freeBoard' })
  @UseGuards(JwtAuthGuard)
  @Put(':freeBoardId')
  putUpdate(
    @User() user: UserDto,
    @Param('freeBoardId', ParsePositiveIntPipe) freeBoardId: number,
    @Body() putUpdateFreeBoardDto: PutUpdateFreeBoardDto,
  ): Promise<FreeBoardDto> {
    return this.freeBoardService.putUpdate(
      user.id,
      freeBoardId,
      putUpdateFreeBoardDto,
    );
  }

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
