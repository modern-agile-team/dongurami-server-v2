import { DynamicModule, Module, Type } from '@nestjs/common';
import { COMMON_POST_REPOSITORY_TOKEN } from '@src/apis/common-posts/constants/common-posts.token';
import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { RequiredCommonPostColumn } from '@src/apis/common-posts/types/common-post.type';

@Module({
  providers: [CommonPostsService],
  exports: [CommonPostsService],
})
export class CommonPostsModule {
  static forFeature(postEntity: Type<RequiredCommonPostColumn>): DynamicModule {
    return {
      module: CommonPostsModule,
      providers: [
        {
          provide: COMMON_POST_REPOSITORY_TOKEN,
          useClass: postEntity,
        },
      ],
    };
  }
}
