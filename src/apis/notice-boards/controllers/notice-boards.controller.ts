import {
  Body,
  Controller,
  Get,
  // Delete,
  // Get,
  Param,
  ParseIntPipe,
  // Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateNoticeBoardDto } from '../dto/create-notice-board.dto';
import { NoticeBoardsService } from '../services/notice-boards.service';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { ApiNoticeBoard } from './notice-boards.swagger';
import { ApiTags } from '@nestjs/swagger';
import { NOTICE_BOARD_ORDER_FIELD } from '../constants/notice-board.constant';

@ApiTags('notice-boards')
@Controller('notice-boards')
export class NoticeBoardsController {
  constructor(private readonly noticeBoardService: NoticeBoardsService) {}

  @ApiNoticeBoard.Create({ summary: 'notice-board 게시글 생성 API' })
  @SetResponse({ type: ResponseType.Detail, key: 'board' })
  @Post(':userId')
  create(
    // 추후 develop에 guard가 merge 될 시에 수정
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createNoticeBoardDto: CreateNoticeBoardDto,
  ) {
    return this.noticeBoardService.create(userId, createNoticeBoardDto);
  }

  @Get()
  async findAllAndCount(
    @Query() findNoticeBoardQueryDto: FindNoticeBoardQueryDto,
  ) {}
  // @Get(':id')
  // findOne() {}

  // @Patch(':id')
  // update() {}

  // @Delete(':id')
  // remove() {}
}
