import {
  Body,
  Controller,
  Get,
  Param,
  // Delete,
  // Get,
  // Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateNoticeBoardDto } from '../dto/create-notice-board.dto';
import { NoticeBoardsService } from '../services/notice-boards.service';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { ApiNoticeBoard } from './notice-boards.swagger';
import { ApiTags } from '@nestjs/swagger';
import { FindNoticeBoardListQueryDto } from '../dto/find-notice-board-list-query.dto';
import { NoticeBoardsItemDto } from '../dto/notice-boards-item.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { NoticeBoardDto } from '../dto/notice-board.dto';

@ApiTags('notice-boards')
@Controller('notice-boards')
export class NoticeBoardsController {
  constructor(private readonly noticeBoardService: NoticeBoardsService) {}

  @ApiNoticeBoard.Create({ summary: '공지 게시글 생성 API' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'noticeBoard' })
  @Post()
  create(
    @User() user: UserDto,
    @Body() createNoticeBoardDto: CreateNoticeBoardDto,
  ) {
    return this.noticeBoardService.create(user.id, createNoticeBoardDto);
  }

  @ApiNoticeBoard.FindAllAndCount({
    summary: '공지 게시글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'noticeBoards' })
  @Get()
  async findAllAndCount(
    @Query() findNoticeBoardListQueryDto: FindNoticeBoardListQueryDto,
  ): Promise<[NoticeBoardsItemDto[], number]> {
    const [noticeBoards, count] = await this.noticeBoardService.findAllAndCount(
      findNoticeBoardListQueryDto,
    );

    return [plainToInstance(NoticeBoardsItemDto, noticeBoards), count];
  }

  @ApiNoticeBoard.FindOneOrNotFound({ summary: '공지게시글 상세조회 ' })
  @SetResponse({ type: ResponseType.Detail, key: 'noticeBoard' })
  @Get(':noticeBoardId')
  findOneOrNotFound(
    @Param('noticeBoardId', ParsePositiveIntPipe) noticeBoardId: number,
  ): Promise<NoticeBoardDto> {
    return this.noticeBoardService.findOneOrNotFound(noticeBoardId);
  }

  // @Patch(':id')
  // update() {}

  // @Delete(':id')
  // remove() {}
}
