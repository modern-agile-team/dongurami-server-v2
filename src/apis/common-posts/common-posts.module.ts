import { DynamicModule, Module } from '@nestjs/common';
import { COMMON_POST_REPOSITORY_TOKEN } from '@src/apis/common-posts/constants/common-posts.token';
import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';

@Module({
  providers: [CommonPostsService],
  exports: [CommonPostsService],
})
export class CommonPostsModule {
  static forFeature(postRepository: any): DynamicModule {
    return {
      module: CommonPostsModule,
      providers: [
        {
          provide: COMMON_POST_REPOSITORY_TOKEN,
          useValue: postRepository,
        },
      ],
    };
  }
}
