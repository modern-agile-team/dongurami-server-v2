import { Injectable } from '@nestjs/common';

import { FindPostListQueryDto } from '@src/apis/posts/dto/find-post-list-query.dto';
import { PostRepository } from '@src/apis/posts/repositories/post.repository';
import { QueryHelper } from '@src/helpers/query.helper';

@Injectable()
export class PostsService {
  private readonly LIKE_SEARCH_FIELD = ['title'] as const;

  constructor(
    private readonly postRepository: PostRepository,
    private readonly queryHelper: QueryHelper,
  ) {}

  findAllAndCount(findPostListQueryDto: FindPostListQueryDto) {
    const { page, pageSize, order, ...filter } = findPostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    return this.postRepository.findAllAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }
}
