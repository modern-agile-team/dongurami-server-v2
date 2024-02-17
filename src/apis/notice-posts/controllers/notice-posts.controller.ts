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

import { plainToInstance } from 'class-transformer';

import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiNoticePost } from '@src/apis/notice-posts/controllers/notice-posts.swagger';
import { CreateNoticePostDto } from '@src/apis/notice-posts/dto/create-notice-post.dto';
import { FindNoticePostListQueryDto } from '@src/apis/notice-posts/dto/find-notice-post-list-query.dto';
import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';
import { NoticePostsItemDto } from '@src/apis/notice-posts/dto/notice-posts-item.dto';
import { PatchUpdateNoticePostDto } from '@src/apis/notice-posts/dto/patch-update-notice-post.dto';
import { PutUpdateNoticePostDto } from '@src/apis/notice-posts/dto/put-update-notice-post.dto';
import { NoticePostsService } from '@src/apis/notice-posts/services/notice-posts.service';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

@ApiTags('notice-post')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
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
  @Get(':postId')
  findOneOrNotFound(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<NoticePostDto> {
    return this.noticePostService.findOneOrNotFound(postId);
  }

  @ApiNoticePost.PutUpdate({ summary: '공지게시글 수정' })
  @SetResponse({ key: 'noticePost', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Put(':postId')
  putUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserDto,
    @Body() putUpdateNoticePostDto: PutUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    return this.noticePostService.putUpdate(
      postId,
      user.id,
      putUpdateNoticePostDto,
    );
  }

  @ApiNoticePost.PatchUpdate({ summary: '공지게시글 patch 수정 ' })
  @SetResponse({ key: 'noticePost', type: ResponseType.Detail })
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  patchUpdate(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserDto,
    @Body() patchUpdateNoticePostDto: PatchUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    return this.noticePostService.patchUpdate(
      postId,
      user.id,
      patchUpdateNoticePostDto,
    );
  }

  @ApiNoticePost.Remove({ summary: '공지 게시글 삭제' })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  remove(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserDto,
  ): Promise<number> {
    return this.noticePostService.remove(user.id, postId);
  }

  @ApiNoticePost.IncreaseHit({ summary: '조회수 1 증가' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':postId/hit')
  increaseHit(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<void> {
    return this.noticePostService.increaseHit(postId);
  }
}
