import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiNoticePostComment } from '@src/apis/notice-post-comments/controllers/notice-post-comments.swagger';
import { CreateNoticePostCommentDto } from '@src/apis/notice-post-comments/dto/create-notice-post-comment.dto';
import { FindNoticePostCommentListQueryDto } from '@src/apis/notice-post-comments/dto/find-notice-post-comment-list-query.dto';
import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';
import { NoticePostCommentsItemDto } from '@src/apis/notice-post-comments/dto/notice-post-comments-item.dto';
import { PutUpdateNoticePostCommentDto } from '@src/apis/notice-post-comments/dto/put-update-notice-post-comment.dto';
import { NoticePostCommentsService } from '@src/apis/notice-post-comments/services/notice-post-comments.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

@ApiTags('notice-post-comment')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('notice-posts/:postId/comments')
export class NoticePostCommentsController {
  constructor(
    private readonly noticePostCommentsService: NoticePostCommentsService,
  ) {}

  @ApiNoticePostComment.Create({ summary: '공지 게시글 댓글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'noticePostComment', type: ResponseType.Detail })
  @Post()
  create(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @User() user: UserDto,
    @Body() createNoticePostCommentDto: CreateNoticePostCommentDto,
  ): Promise<NoticePostCommentDto> {
    return this.noticePostCommentsService.create(
      user.id,
      postId,
      createNoticePostCommentDto,
    );
  }

  @ApiNoticePostComment.FindAllAndCount({
    summary: '공지 게시글 댓글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'noticePostComments' })
  @Get()
  async findAllAndCount(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Query()
    findNoticePostCommentListQueryDto: FindNoticePostCommentListQueryDto,
  ): Promise<[NoticePostCommentsItemDto[], number]> {
    const [comments, count] =
      await this.noticePostCommentsService.findAllAndCount(
        postId,
        findNoticePostCommentListQueryDto,
      );

    return [plainToInstance(NoticePostCommentsItemDto, comments), count];
  }

  @ApiNoticePostComment.PutUpdate({ summary: '공지게시글 댓글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'noticePostComment' })
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  putUpdate(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Body() putUpdateNoticePostCommentDto: PutUpdateNoticePostCommentDto,
  ): Promise<NoticePostCommentDto> {
    return this.noticePostCommentsService.putUpdate(
      user.id,
      postId,
      commentId,
      putUpdateNoticePostCommentDto,
    );
  }

  @ApiNoticePostComment.Remove({
    summary: '공지게시글 댓글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  remove(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
  ): Promise<number> {
    return this.noticePostCommentsService.remove(user.id, postId, commentId);
  }

  @ApiNoticePostComment.CreateReaction({
    summary: '공지 게시글 댓글 reaction 생성',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post(':commentId/reaction')
  createReaction(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<void> {
    return this.noticePostCommentsService.createReaction(
      user.id,
      postId,
      commentId,
      createReactionDto,
    );
  }

  @ApiNoticePostComment.RemoveReaction({
    summary: '공지 게시글 댓글 reaction 삭제',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId/reaction')
  removeReaction(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Body() removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    return this.noticePostCommentsService.removeReaction(
      user.id,
      postId,
      commentId,
      removeReactionDto,
    );
  }
}
