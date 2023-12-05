import {
  Body,
  Controller,
  Delete,
  Get,
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
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';
import { plainToInstance } from 'class-transformer';
import { CreateFreePostDto } from '../dto/create-free-post.dto';
import { FreePostsService } from '../services/free-posts.service';

/**
 * @todo soft delete 로 변경
 */
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

  /**
   * 테이블 참조 때문에 삭제 불가 개선 예정
   */
  @ApiFreePost.Remove({
    summary:
      '자유게시글 삭제 (현재 내부 사정으로 서버에러가 무조건적으로 발생합니다.',
    deprecated: true,
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
}
