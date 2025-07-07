import { Module } from '@nestjs/common';

import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { FreePostsController } from '@src/apis/free-posts/controllers/free-posts.controller';
import { FreePostTagLinkRepository } from '@src/apis/free-posts/repositories/free-post-tag-link.repository';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { PostTagsModule } from '@src/apis/post-tags/post-tags.module';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { UsersModule } from '@src/apis/users/users.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePost } from '@src/entities/FreePost';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FreePostRepository,
      FreePostTagLinkRepository,
    ]),
    CommonPostsModule.forFeature(FreePost),
    ReactionsModule.forFeature(FreePostReaction),
    PostTagsModule,
    UsersModule,
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
  exports: [FreePostsService],
})
export class FreePostsModule {}
