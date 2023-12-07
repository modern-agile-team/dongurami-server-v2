import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  // Delete,
  // Get,
  // Patch,
  Post,
  Put,
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
import { NoticePostDto } from '../dto/notice-post.dto';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { PutUpdateNoticePostDto } from '../dto/put-update-notice-post.dto';
import { PatchUpdateNoticePostDto } from '../dto/patch-update-notice-post.dto';

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

  @ApiNoticePost.FindOneOrNotFound({ summary: '공지게시글 상세조회 ' })
  @SetResponse({ type: ResponseType.Detail, key: 'noticePost' })
  @Get(':noticePostId')
  findOneOrNotFound(
    @Param('noticePostId', ParsePositiveIntPipe) noticePostId: number,
  ): Promise<NoticePostDto> {
    return this.noticePostService.findOneOrNotFound(noticePostId);
  }

  @ApiNoticePost.PutUpdate({ summary: '공지게시글 수정' })
  @SetResponse({ key: 'noticePost', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Put(':noticePostId')
  putUpdate(
    @Param('noticePostId', ParsePositiveIntPipe) noticePostId: number,
    @User() user: UserDto,
    @Body() putUpdateNoticePostDto: PutUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    return this.noticePostService.putUpdate(
      noticePostId,
      user.id,
      putUpdateNoticePostDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiNoticePost.PatchUpdate({ summary: '공지게시글 patch 수정 ' })
  @SetResponse({ key: 'noticePost', type: ResponseType.Detail })
  @Patch(':id')
  patchUpdate(
    @User() user: UserDto,
    @Body() patchUpdateNoticePostDto: PatchUpdateNoticePostDto,
  ) {
    return this.noticePostService.patchUpdate(user, patchUpdateNoticePostDto);
  }

  // @Delete(':id')
  // remove() {}
}
