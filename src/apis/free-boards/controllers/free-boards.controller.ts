import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreeBoard } from '@src/apis/free-boards/controllers/free-board.swagger';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardsItemDto } from '@src/apis/free-boards/dto/free-boards-item.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { plainToInstance } from 'class-transformer';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';
import { FreeBoardsService } from '../services/free-board.service';

/**
 * @todo soft delete 로 변경
 */
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

  /**
   * 테이블 참조 때문에 삭제 불가 개선 예정
   */
  @ApiFreeBoard.Remove({ summary: '자유게시글 삭제' })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':freeBoardId')
  remove(@User() user: UserDto, @Param('freeBoardId') freeBoardId: number) {
    return this.freeBoardService.remove(user.id, freeBoardId);
  }
}
