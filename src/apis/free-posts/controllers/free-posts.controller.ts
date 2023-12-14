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
import { ApiFreePost } from '@src/apis/free-posts/controllers/free-posts.swagger';
import { CreateFreePostCommentDto } from '@src/apis/free-posts/dto/create-free-post-comment.dto';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/create-free-post-reply-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-posts/dto/find-free-post-comment-list-query.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-posts/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-posts/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-posts/dto/free-post-comments-item.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-posts/dto/free-post-reply-comment.dto';
import { FreePostReplyCommentsItemDto } from '@src/apis/free-posts/dto/free-post-reply-comments-item.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-posts/dto/put-update-free-post-comment.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/put-update-free-post-reply-comment.dto';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';
import { CreateFreePostDto } from '../dto/create-free-post.dto';
import { FreePostsService } from '../services/free-posts.service';

@ApiTags('free-posts')
@Controller('free-posts')
export class FreePostsController {
  constructor(private readonly freePostsService: FreePostsService) {}

  @ApiFreePost.Create({ summary: '자유 게시글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freePost', type: ResponseType.Detail })
  @Post()
  create(@User() user: UserDto, @Body() createFreePostDto: CreateFreePostDto) {
    return this.freePostsService.create(user.id, createFreePostDto);
  }

  @ApiFreePost.FindAllAndCount({ summary: '자유 게시글 전체조회(pagination)' })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePosts' })
  @Get()
  async findAllAndCount(
    @Query() findFreePostListQueryDto: FindFreePostListQueryDto,
  ): Promise<[FreePostsItemDto[], number]> {
    const [freePosts, count] = await this.freePostsService.findAllAndCount(
      findFreePostListQueryDto,
    );

    return [plainToInstance(FreePostsItemDto, freePosts), count];
  }

  @ApiFreePost.FindOneOrNotFound({ summary: '자유게시글 상세조회' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @Get(':freePostId')
  findOneOrNotFound(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
  ): Promise<FreePostDto> {
    return this.freePostsService.findOneOrNotFound(freePostId);
  }

  @ApiFreePost.PutUpdate({ summary: '자유게시글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @UseGuards(JwtAuthGuard)
  @Put(':freePostId')
  putUpdate(
    @User() user: UserDto,
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Body() putUpdateFreePostDto: PutUpdateFreePostDto,
  ): Promise<FreePostDto> {
    return this.freePostsService.putUpdate(
      user.id,
      freePostId,
      putUpdateFreePostDto,
    );
  }

  @ApiFreePost.PatchUpdate({ summary: '자유게시글 부분 수정' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @Patch(':freePostId')
  patchUpdate(
    @User() user: UserDto,
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Body() patchUpdateFreePostDto: PatchUpdateFreePostDto,
  ): Promise<FreePostDto> {
    return this.freePostsService.patchUpdate(
      user.id,
      freePostId,
      patchUpdateFreePostDto,
    );
  }

  @ApiFreePost.Remove({
    summary: '자유게시글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':freePostId')
  remove(
    @User() user: UserDto,
    @Param('freePostId') freePostId: number,
  ): Promise<number> {
    return this.freePostsService.remove(user.id, freePostId);
  }

  @ApiFreePost.IncrementHit({ summary: '조회수 증가(1)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':freePostId/hit')
  incrementHit(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
  ): Promise<void> {
    return this.freePostsService.incrementHit(freePostId);
  }

  @ApiFreePost.CreateComment({ summary: '자유 게시글 댓글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freePostComment', type: ResponseType.Detail })
  @Post(':freePostId/comments')
  createComment(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @User() user: UserDto,
    @Body() createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    return this.freePostsService.createComment(
      user.id,
      freePostId,
      createFreePostCommentDto,
    );
  }

  @ApiFreePost.FindAllAndCountComment({
    summary: '자유 게시글 댓글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePostComments' })
  @Get(':freePostId/comments')
  async findAllAndCountComment(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Query() findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto,
  ): Promise<[FreePostCommentsItemDto[], number]> {
    const [freePosts, count] =
      await this.freePostsService.findAllAndCountComment(
        freePostId,
        findFreePostCommentListQueryDto,
      );

    return [plainToInstance(FreePostCommentsItemDto, freePosts), count];
  }

  @ApiFreePost.PutUpdateComment({ summary: '자유게시글 댓글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePostComment' })
  @UseGuards(JwtAuthGuard)
  @Put(':freePostId/comments/:freePostCommentId')
  putUpdateComment(
    @User() user: UserDto,
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Body() putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    return this.freePostsService.putUpdateComment(
      user.id,
      freePostId,
      freePostCommentId,
      putUpdateFreePostCommentDto,
    );
  }

  @ApiFreePost.RemoveComment({
    summary: '자유게시글 댓글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':freePostId/comments/:freePostCommentId')
  removeComment(
    @User() user: UserDto,
    @Param('freePostId') freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
  ): Promise<number> {
    return this.freePostsService.removeComment(
      user.id,
      freePostId,
      freePostCommentId,
    );
  }

  @ApiFreePost.CreateReplyComment({ summary: '자유 게시글 대댓글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freePostReplyComment', type: ResponseType.Detail })
  @Post(':freePostId/comments/:freePostCommentId/reply')
  createReplyComment(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @User() user: UserDto,
    @Body() createFreePostReplyCommentDto: CreateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    return this.freePostsService.createReplyComment(
      user.id,
      freePostId,
      freePostCommentId,
      createFreePostReplyCommentDto,
    );
  }

  @ApiFreePost.FindAllAndCountReplyComment({
    summary: '자유 게시글 대댓글 전체조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePostReplyComments' })
  @Get(':freePostId/comments/:freePostCommentId')
  async findAllAndCountReplyComment(
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Query()
    findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto,
  ): Promise<[FreePostReplyCommentsItemDto[], number]> {
    const [freePosts, count] =
      await this.freePostsService.findAllAndCountReplyComment(
        freePostId,
        freePostCommentId,
        findFreePostReplyCommentListQueryDto,
      );

    return [plainToInstance(FreePostReplyCommentsItemDto, freePosts), count];
  }

  @ApiFreePost.PutUpdateReplyComment({ summary: '자유게시글 대댓글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePostReplyComment' })
  @UseGuards(JwtAuthGuard)
  @Put(':freePostId/comments/:freePostCommentId/reply/:freePostReplyCommentId')
  putUpdateReplyComment(
    @User() user: UserDto,
    @Param('freePostId', ParsePositiveIntPipe) freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Param('freePostReplyCommentId', ParsePositiveIntPipe)
    freePostReplyCommentId: number,
    @Body() putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    return this.freePostsService.putUpdateReplyComment(
      user.id,
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
      putUpdateFreePostReplyCommentDto,
    );
  }

  @ApiFreePost.RemoveReplyComment({
    summary: '자유게시글 대댓글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(
    ':freePostId/comments/:freePostCommentId/reply/:freePostReplyCommentId',
  )
  removeReplyComment(
    @User() user: UserDto,
    @Param('freePostId') freePostId: number,
    @Param('freePostCommentId', ParsePositiveIntPipe) freePostCommentId: number,
    @Param('freePostReplyCommentId', ParsePositiveIntPipe)
    freePostReplyCommentId: number,
  ): Promise<number> {
    return this.freePostsService.removeReplyComment(
      user.id,
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );
  }
}
