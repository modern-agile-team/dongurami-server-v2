import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { CreateFreePostRequestDto } from '@src/apis/free-posts/dto/create-free-post.request-dto';
import { FreePostReactionsItemDto } from '@src/apis/free-posts/dto/free-post-reactions-item.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { ListFreePostReactionRequestDto } from '@src/apis/free-posts/dto/list-free-post-reactions.request-dto';
import { ListFreePostRequestDto } from '@src/apis/free-posts/dto/list-free-post.request-dto';
import { PatchUpdateFreePostRequestDto } from '@src/apis/free-posts/dto/patch-update-free-post.request-dto';
import { PutUpdateFreePostRequestDto } from '@src/apis/free-posts/dto/put-update-free-post.request-dto';
import { FreePostMap } from '@src/apis/free-posts/mappers/free-post.map';
import { FREE_POSTS_SERVICE_TOKEN } from '@src/apis/free-posts/services/free-posts.service';
import { IFreePostsService } from '@src/apis/free-posts/services/free-posts.service.interface';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

/**
 * @todo reaction 분리
 */
@ApiTags('free-post')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('free-posts')
export class FreePostsController {
  constructor(
    @Inject(FREE_POSTS_SERVICE_TOKEN)
    private readonly freePostsService: IFreePostsService,
  ) {}

  @ApiFreePost.Create({ summary: '자유 게시글 생성' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ key: 'freePost', type: ResponseType.Detail })
  @Post()
  async create(
    @User() user: UserDto,
    @Body() createFreePostRequestDto: CreateFreePostRequestDto,
  ): Promise<FreePostDto> {
    const freePost = await this.freePostsService.create({
      userId: user.id,
      title: createFreePostRequestDto.title,
      description: createFreePostRequestDto.description,
      isAnonymous: createFreePostRequestDto.isAnonymous,
      tagNames: createFreePostRequestDto.tagNames,
    });

    return FreePostMap.toDto(freePost);
  }

  @ApiFreePost.FindAllAndCount({ summary: '자유 게시글 전체조회(pagination)' })
  @SetResponse({ type: ResponseType.Pagination, key: 'freePosts' })
  @Get()
  async findAllAndCount(
    @Query() findFreePostListRequestDto: ListFreePostRequestDto,
  ): Promise<[FreePostsItemDto[], number]> {
    const [freePosts, count] = await this.freePostsService.findAllAndCount({
      id: findFreePostListRequestDto.id,
      userId: findFreePostListRequestDto.userId,
      title: findFreePostListRequestDto.title,
      isAnonymous: findFreePostListRequestDto.isAnonymous,
      order: findFreePostListRequestDto.order,
      page: findFreePostListRequestDto.page,
      pageSize: findFreePostListRequestDto.pageSize,
    });

    return [freePosts.map(FreePostMap.toItemDto), count];
  }
  @ApiFreePost.FindOneOrNotFound({ summary: '자유게시글 상세조회' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @Get(':postId')
  async findOneOrNotFound(
    @Param('postId') postId: string,
  ): Promise<FreePostDto> {
    const freePost = await this.freePostsService.findOneOrNotFound(postId);

    return FreePostMap.toDto(freePost);
  }

  @ApiFreePost.PutUpdate({ summary: '자유게시글 수정' })
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @UseGuards(JwtAuthGuard)
  @Put(':postId')
  async putUpdate(
    @User() user: UserDto,
    @Param('postId') postId: string,
    @Body() putUpdateFreePostRequestDto: PutUpdateFreePostRequestDto,
  ): Promise<FreePostDto> {
    const freePost = await this.freePostsService.putUpdate({
      id: postId,
      userId: user.id,
      title: putUpdateFreePostRequestDto.title,
      description: putUpdateFreePostRequestDto.description,
      isAnonymous: putUpdateFreePostRequestDto.isAnonymous,
      tagNames: putUpdateFreePostRequestDto.tagNames,
    });

    return FreePostMap.toDto(freePost);
  }

  @ApiFreePost.PatchUpdate({ summary: '자유게시글 부분 수정' })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'freePost' })
  @Patch(':postId')
  async patchUpdate(
    @User() user: UserDto,
    @Param('postId') postId: string,
    @Body() patchUpdateFreePostRequestDto: PatchUpdateFreePostRequestDto,
  ): Promise<FreePostDto> {
    const freePost = await this.freePostsService.patchUpdate({
      id: postId,
      userId: user.id,
      title: patchUpdateFreePostRequestDto.title,
      description: patchUpdateFreePostRequestDto.description,
      isAnonymous: patchUpdateFreePostRequestDto.isAnonymous,
      tagNames: patchUpdateFreePostRequestDto.tagNames,
    });

    return FreePostMap.toDto(freePost);
  }

  @ApiFreePost.Remove({
    summary: '자유게시글 삭제',
  })
  @SetResponse({ type: ResponseType.Delete })
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  remove(
    @User() user: UserDto,
    @Param('postId') postId: string,
  ): Promise<number> {
    return this.freePostsService.remove({
      id: postId,
      userId: user.id,
    });
  }

  @ApiFreePost.IncrementHit({ summary: '조회수 증가(1)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':postId/hit')
  incrementHit(@Param('postId') postId: string): Promise<void> {
    return this.freePostsService.incrementHit(postId);
  }

  @ApiFreePost.CreateReaction({ summary: '자유 게시글 reaction 생성' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post(':postId/reaction')
  createReaction(
    @User() user: UserDto,
    @Param('postId') postId: string,
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<void> {
    return this.freePostsService.createReaction({
      postId,
      userId: user.id,
      reactionName: createReactionDto.type,
    });
  }

  @ApiFreePost.FindAllAndCountReactions({
    summary: '특정 자유 게시글 reactions 전체 조회(pagination)',
  })
  @SetResponse({ type: ResponseType.Pagination, key: 'reactions' })
  @Get(':postId/reactions')
  async findAllAndCountReactions(
    @Param('postId') postId: string,
    @Query()
    findFreePostReactionListRequestDto: ListFreePostReactionRequestDto,
  ): Promise<[FreePostReactionsItemDto[], number]> {
    const [freePostReactions, count] =
      await this.freePostsService.findAllAndCountReactions({
        postId,
        userId: findFreePostReactionListRequestDto.userId,
        reactionName: findFreePostReactionListRequestDto.type,
        order: findFreePostReactionListRequestDto.order,
        page: findFreePostReactionListRequestDto.page,
        pageSize: findFreePostReactionListRequestDto.pageSize,
      });

    return [
      plainToInstance(FreePostReactionsItemDto, freePostReactions),
      count,
    ];
  }

  @ApiFreePost.RemoveReaction({ summary: '자유 게시글 reaction 삭제' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/reaction')
  removeReaction(
    @User() user: UserDto,
    @Param('postId') postId: string,
    @Body() removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    return this.freePostsService.removeReaction({
      postId,
      userId: user.id,
      reactionName: removeReactionDto.type,
    });
  }
}
