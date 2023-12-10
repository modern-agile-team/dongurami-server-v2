import { Inject, Injectable } from '@nestjs/common';
import { CommonPostStatus } from '@src/apis/common-posts/constants/common-posts.enum';
import { COMMON_POST_REPOSITORY_TOKEN } from '@src/apis/common-posts/constants/common-posts.token';
import { RequiredCommonPostColumn } from '@src/apis/common-posts/types/common-post.type';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class CommonPostsService<E extends RequiredCommonPostColumn> {
  constructor(
    @Inject(COMMON_POST_REPOSITORY_TOKEN)
    private readonly postRepository: Repository<E>,
  ) {}

  async incrementHit(postId: number): Promise<void> {
    const updateResult = await this.postRepository.increment(
      {
        id: postId,
        status: CommonPostStatus.Posting,
      } as FindOptionsWhere<E>,
      'hit',
      1,
    );

    if (!updateResult.affected) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }
  }
}
