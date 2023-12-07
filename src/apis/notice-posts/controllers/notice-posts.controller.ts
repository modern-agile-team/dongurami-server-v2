import {
  Body,
  Controller,
  Get,
  // Delete,
  // Get,
  // Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateNoticePostDto } from '../dto/create-notice-post.dto';
import { NoticePostsService } from '../services/notice-posts.service';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { ApiNoticePost } from './notice-posts.swagger';
import { ApiTags } from '@nestjs/swagger';
import { FindNoticePostListQueryDto } from '../dto/find-notice-post-list-query.dto';
import { NoticePostsItemDto } from '../dto/notice-posts-item.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';

@ApiTags('notice-posts')
@Controller('notice-posts')
export class NoticePostsController {
  constructor(private readonly noticePostService: NoticePostsService) {}

  @ApiNoticePost.Create({ summary: '공지 게시글 생성 API' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'noticePost' })
  @Post()
  create(
    @User() user: UserDto,
    @Body() createNoticePostDto: CreateNoticePostDto,
  ) {
    return this.noticePostService.create(user.id, createNoticePostDto);
  }

  @ApiNoticePost.FindAllAndCount({
    summary: '공지 게시글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'noticePosts' })
  @Get()
  async findAllAndCount(
    @Query() findNoticePostListQueryDto: FindNoticePostListQueryDto,
  ): Promise<[NoticePostsItemDto[], number]> {
    const [noticePosts, count] = await this.noticePostService.findAllAndCount(
      findNoticePostListQueryDto,
    );

    return [plainToInstance(NoticePostsItemDto, noticePosts), count];
  }
  // @Get(':id')
  // findOne() {}

  // @Patch(':id')
  // update() {}

  // @Delete(':id')
  // remove() {}
}
