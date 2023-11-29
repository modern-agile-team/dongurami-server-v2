import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNoticeBoardDto } from '../dto/create-notice-board.dto';
import { NoticeBoardsService } from '../services/notice-boards.service';

@Controller('notice-boards')
export class NoticeBoardsController {
  constructor(private readonly noticeBoardService: NoticeBoardsService) {}

  @Post(':userId')
  create(
    // 추후 develop에 guard가 merge 될 시에 수정
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createNoticeBoardDto: CreateNoticeBoardDto,
  ) {
    return this.noticeBoardService.create(userId, createNoticeBoardDto);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
