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
import { ApiFreePost } from '@src/apis/free-posts/controllers/free-posts.swagger';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

@ApiTags('free-post')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
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
  @Get(':postId')
  findOneOrNotFound(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<FreePostDto> {
    return this.freePostsService.findOneOrNotFound(postId);
  }

  @ApiFreePost.PutUpdate({ summary: '자유게시글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @UseGuards(JwtAuthGuard)
  @Put(':postId')
  putUpdate(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() putUpdateFreePostDto: PutUpdateFreePostDto,
  ): Promise<FreePostDto> {
    return this.freePostsService.putUpdate(
      user.id,
      postId,
      putUpdateFreePostDto,
    );
  }

  @ApiFreePost.PatchUpdate({ summary: '자유게시글 부분 수정' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @Patch(':postId')
  patchUpdate(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() patchUpdateFreePostDto: PatchUpdateFreePostDto,
  ): Promise<FreePostDto> {
    return this.freePostsService.patchUpdate(
      user.id,
      postId,
      patchUpdateFreePostDto,
    );
  }

  @ApiFreePost.Remove({
    summary: '자유게시글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  remove(
    @User() user: UserDto,
    @Param('postId') postId: number,
  ): Promise<number> {
    return this.freePostsService.remove(user.id, postId);
  }

  @ApiFreePost.IncrementHit({ summary: '조회수 증가(1)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':postId/hit')
  incrementHit(
    @Param('postId', ParsePositiveIntPipe) postId: number,
  ): Promise<void> {
    return this.freePostsService.incrementHit(postId);
  }

  @ApiFreePost.CreateReaction({ summary: '자유 게시글 reaction 생성' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post(':postId/reaction')
  createReaction(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<void> {
    return this.freePostsService.createReaction(
      user.id,
      postId,
      createReactionDto,
    );
  }

  @ApiFreePost.RemoveReaction({ summary: '자유 게시글 reaction 삭제' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/reaction')
  removeReaction(
    @User() user: UserDto,
    @Param('postId', ParsePositiveIntPipe) postId: number,
    @Body() removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    return this.freePostsService.removeReaction(
      user.id,
      postId,
      removeReactionDto,
    );
  }
}
