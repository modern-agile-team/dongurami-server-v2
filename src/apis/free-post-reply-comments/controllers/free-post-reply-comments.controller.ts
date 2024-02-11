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
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreePostReplyComment } from '@src/apis/free-post-reply-comments/controllers/free-post-reply-comments.swagger';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/create-free-post-reply-comment.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-post-reply-comments/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comment.dto';
import { FreePostReplyCommentsItemDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comments-item.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/put-update-free-post-reply-comment.dto';
import { FreePostReplyCommentsService } from '@src/apis/free-post-reply-comments/services/free-post-reply-comments.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';

@ApiTags('free-post-reply-comment')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('free-posts/:postId/comments/:commentId/reply')
export class FreePostReplyCommentsController {
  constructor(
    private readonly freePostReplyCommentsService: FreePostReplyCommentsService,
  ) {}

  @ApiFreePostReplyComment.Create({
    summary: '자유 게시글 대댓글 생성',
  })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freePostReplyComment', type: ResponseType.Detail })
  @Post()
  create(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Body() createFreePostReplyCommentDto: CreateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    return this.freePostReplyCommentsService.create(
      user.id,
      postId,
      commentId,
      createFreePostReplyCommentDto,
    );
  }

  @ApiFreePostReplyComment.FindAllAndCount({
    summary: '자유 게시글 대댓글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePostReplyComments' })
  @Get()
  async findAllAndCount(
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Query()
    findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto,
  ): Promise<[FreePostReplyCommentsItemDto[], number]> {
    const [freePosts, count] =
      await this.freePostReplyCommentsService.findAllAndCount(
        postId,
        commentId,
        findFreePostReplyCommentListQueryDto,
      );

    return [plainToInstance(FreePostReplyCommentsItemDto, freePosts), count];
  }

  @ApiFreePostReplyComment.PutUpdate({
    summary: '자유게시글 대댓글 수정',
  })
  @SetResponse({ type: ResponseType.Detail, key: 'freePostReplyComment' })
  @UseGuards(JwtAuthGuard)
  @Put(':replyId')
  putUpdate(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Param('replyId', ParsePositiveIntPipe) replyId: number,
    @Body() putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    return this.freePostReplyCommentsService.putUpdate(
      user.id,
      postId,
      commentId,
      replyId,
      putUpdateFreePostReplyCommentDto,
    );
  }

  @ApiFreePostReplyComment.Remove({
    summary: '자유게시글 대댓글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':replyId')
  remove(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Param('replyId', ParsePositiveIntPipe) replyId: number,
  ): Promise<number> {
    return this.freePostReplyCommentsService.remove(
      user.id,
      postId,
      commentId,
      replyId,
    );
  }

  @ApiFreePostReplyComment.CreateReaction({
    summary: '자유 게시글 대댓글 reaction 생성',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post(':replyId/reaction')
  createReaction(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Param('replyId', ParsePositiveIntPipe) replyId: number,
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<void> {
    return this.freePostReplyCommentsService.createReaction(
      user.id,
      postId,
      commentId,
      replyId,
      createReactionDto,
    );
  }

  @ApiFreePostReplyComment.RemoveReaction({
    summary: '자유 게시글 대댓글 reaction 삭제',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':replyId/reaction')
  removeReaction(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Param('commentId', ParsePositiveIntPipe) commentId: number,
    @Param('replyId', ParsePositiveIntPipe) replyId: number,
    @Body() removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    return this.freePostReplyCommentsService.removeReaction(
      user.id,
      postId,
      commentId,
      replyId,
      removeReactionDto,
    );
  }
}
