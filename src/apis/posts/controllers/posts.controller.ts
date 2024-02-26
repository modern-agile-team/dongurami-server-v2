import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { ApiPost } from '@src/apis/posts/controllers/posts.swagger';
import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query.dto';
import { PostsItemDto } from '@src/apis/posts/dto/posts-item.dto';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

@ApiTags('post')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiPost.FindAllAndCount({ summary: '게시글 전체 조회(자유, 공지)' })
  @SetResponse({ type: ResponseType.Pagination, key: 'posts' })
  @Get()
  async findAllAndCount(@Query() findPostListQueryDto: FindPostListQueryDto) {
    const [posts, count] =
      await this.postsService.findAllAndCount(findPostListQueryDto);

    return [plainToInstance(PostsItemDto, posts), count];
  }
}
