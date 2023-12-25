import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';

@ApiTags('free-posts')
@Controller('free-posts/:freePostId/comments/:freePostCommentId/reply')
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
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Body() createFreePostReplyCommentDto: CreateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    return this.freePostReplyCommentsService.create(
      user.id,
      freePostId,
      freePostCommentId,
      createFreePostReplyCommentDto,
    );
  }

  @ApiFreePostReplyComment.FindAllAndCount({
    summary: '자유 게시글 대댓글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePostReplyComments' })
  @Get()
  async findAllAndCount(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Query()
    findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto,
  ): Promise<[FreePostReplyCommentsItemDto[], number]> {
    const [freePosts, count] =
      await this.freePostReplyCommentsService.findAllAndCount(
        freePostId,
        freePostCommentId,
        findFreePostReplyCommentListQueryDto,
      );

    return [plainToInstance(FreePostReplyCommentsItemDto, freePosts), count];
  }

  @ApiFreePostReplyComment.PutUpdate({
    summary: '자유게시글 대댓글 수정',
  })
  @SetResponse({ type: ResponseType.Detail, key: 'freePostReplyComment' })
  @UseGuards(JwtAuthGuard)
  @Put(':freePostReplyCommentId')
  putUpdate(
    @User() user: UserDto,
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Param('freePostReplyCommentId', ParsePositiveIntPipe)
    freePostReplyCommentId: number,
    @Body() putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    return this.freePostReplyCommentsService.putUpdate(
      user.id,
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
      putUpdateFreePostReplyCommentDto,
    );
  }

  @ApiFreePostReplyComment.Remove({
    summary: '자유게시글 대댓글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':freePostReplyCommentId')
  remove(
    @User() user: UserDto,
    @Param('freePostId') freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Param('freePostReplyCommentId', ParsePositiveIntPipe)
    freePostReplyCommentId: number,
  ): Promise<number> {
    return this.freePostReplyCommentsService.remove(
      user.id,
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );
  }
}
