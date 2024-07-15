import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { FreePostsController } from '@src/apis/free-posts/controllers/free-posts.controller';
import {
  FREE_POST_REPOSITORY_TOKEN,
  FreePostRepository,
} from '@src/apis/free-posts/repositories/free-post.repository';
import {
  FREE_POSTS_SERVICE_TOKEN,
  FreePostsService,
} from '@src/apis/free-posts/services/free-posts.service';
import { PostTagsModule } from '@src/apis/post-tags/post-tags.module';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import {
  USER_REPOSITORY_TOKEN,
  UserRepository,
} from '@src/apis/users/repositories/user.repository';
import { UsersModule } from '@src/apis/users/users.module';
import { FreePost } from '@src/entities/FreePost';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { User } from '@src/entities/User';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([FreePost, User]),
    CommonPostsModule.forFeature(FreePost),
    ReactionsModule.forFeature(FreePostReaction),
    PostTagsModule,
    UsersModule,
  ],
  controllers: [FreePostsController],
  providers: [
    {
      provide: FREE_POSTS_SERVICE_TOKEN,
      useClass: FreePostsService,
    },
    {
      provide: FREE_POST_REPOSITORY_TOKEN,
      useClass: FreePostRepository,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    QueryHelper,
  ],
  exports: [FREE_POSTS_SERVICE_TOKEN],
})
export class FreePostsModule {}
