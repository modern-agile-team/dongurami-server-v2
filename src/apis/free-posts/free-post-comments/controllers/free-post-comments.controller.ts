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
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { ApiFreePostComment } from '@src/apis/free-posts/free-post-comments/controllers/free-post-comments.swagger';
import { CreateFreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-posts/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-posts/free-post-comments/dto/free-post-comments-item.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/put-update-free-post-comment.dto';
import { FreePostCommentsService } from '@src/apis/free-posts/free-post-comments/services/free-post-comments.service';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';

@Controller('free-posts/:freePostId/comments')
export class FreePostCommentsController {
  constructor(
    private readonly freePostCommentsService: FreePostCommentsService,
  ) {}

  @ApiFreePostComment.Create({ summary: '자유 게시글 댓글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freePostComment', type: ResponseType.Detail })
  @Post()
  create(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @User() user: UserDto,
    @Body() createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    return this.freePostCommentsService.create(
      user.id,
      freePostId,
      createFreePostCommentDto,
    );
  }

  @ApiFreePostComment.FindAllAndCount({
    summary: '자유 게시글 댓글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePostComments' })
  @Get()
  async findAllAndCount(
    @Query() findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto,
  ): Promise<[FreePostCommentsItemDto[], number]> {
    const [freePosts, count] =
      await this.freePostCommentsService.findAllAndCount(
        findFreePostCommentListQueryDto,
      );

    return [plainToInstance(FreePostCommentsItemDto, freePosts), count];
  }

  @ApiFreePostComment.PutUpdate({ summary: '자유게시글 댓글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePostComment' })
  @UseGuards(JwtAuthGuard)
  @Put(':freePostCommentId')
  putUpdate(
    @User() user: UserDto,
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Body() putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    return this.freePostCommentsService.putUpdate(
      user.id,
      freePostId,
      freePostCommentId,
      putUpdateFreePostCommentDto,
    );
  }

  @ApiFreePostComment.Remove({
    summary: '자유게시글 댓글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':freePostCommentId')
  remove(
    @User() user: UserDto,
    @Param('freePostId') freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
  ): Promise<number> {
    return this.freePostCommentsService.remove(
      user.id,
      freePostId,
      freePostCommentId,
    );
  }
}
