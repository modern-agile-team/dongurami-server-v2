import { Inject, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CommonPostStatus } from '@src/apis/common-posts/constants/common-posts.enum';
import { COMMON_POST_REPOSITORY_TOKEN } from '@src/apis/common-posts/constants/common-posts.token';
import { RequiredCommonPostColumn } from '@src/apis/common-posts/types/common-post.type';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class CommonPostsService<E extends RequiredCommonPostColumn> {
  constructor(
    @Inject(COMMON_POST_REPOSITORY_TOKEN)
    private readonly postRepository: Repository<E>,
  ) {}

  async incrementHit(postId: number): Promise<void> {
    const updateResult = await this.postRepository
      .createQueryBuilder('post')
      .update()
      .set({ hit: () => 'hit + 1' } as QueryDeepPartialEntity<E>)
      .where({ id: postId, status: CommonPostStatus.Posting })
      .callListeners(false)
      .execute();

    if (!updateResult.affected) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }
  }
}
