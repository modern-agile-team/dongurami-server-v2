import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';
import { CreateNoticePostDto } from '../dto/create-notice-post.dto';
import { FindNoticePostListQueryDto } from '../dto/find-notice-post-list-query.dto';
import { NoticePostDto } from '../dto/notice-post.dto';
import { NoticePostsItemDto } from '../dto/notice-posts-item.dto';
import { PatchUpdateNoticePostDto } from '../dto/patch-update-notice-post.dto';
import { PutUpdateNoticePostDto } from '../dto/put-update-notice-post.dto';
import { NoticePostsService } from '../services/notice-posts.service';
import { ApiNoticePost } from './notice-posts.swagger';

@ApiTags('notice-post')
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

  @ApiNoticePost.PatchUpdate({ summary: '공지게시글 patch 수정 ' })
  @SetResponse({ key: 'noticePost', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Patch(':noticePostId')
  patchUpdate(
    @Param('noticePostId', ParsePositiveIntPipe) noticePostId: number,
    @User() user: UserDto,
    @Body() patchUpdateNoticePostDto: PatchUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    return this.noticePostService.patchUpdate(
      noticePostId,
      user.id,
      patchUpdateNoticePostDto,
    );
  }

  @ApiNoticePost.Remove({ summary: '공지 게시글 삭제' })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':noticePostId')
  remove(
    @Param('noticePostId', ParsePositiveIntPipe) noticePostId: number,
    @User() user: UserDto,
  ): Promise<number> {
    return this.noticePostService.remove(user.id, noticePostId);
  }

  @ApiNoticePost.IncreaseHit({ summary: '조회수 1 증가' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':noticePostId/hit')
  increaseHit(
    @Param('noticePostId', ParsePositiveIntPipe) noticePostId: number,
  ): Promise<void> {
    return this.noticePostService.increaseHit(noticePostId);
  }
}
