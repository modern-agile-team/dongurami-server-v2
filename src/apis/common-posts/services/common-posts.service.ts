import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { COMMON_POST_REPOSITORY_TOKEN } from '@src/apis/common-posts/constants/common-posts.token';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { Repository } from 'typeorm';

@Injectable()
export class CommonPostsService implements OnModuleInit {
  private postRepository: Repository<any>;

  constructor(
    @Inject(COMMON_POST_REPOSITORY_TOKEN)
    private readonly PostRepository: typeof Repository<any>,

    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.postRepository = this.moduleRef.get<Repository<any>>(
      this.PostRepository,
      {
        strict: false,
      },
    );
  }

  async incrementHit(postId: number): Promise<void> {
    const updateResult = await this.postRepository.increment(
      {
        id: postId,
      },
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
