import { Module } from '@nestjs/common';

import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { FreePostsController } from '@src/apis/free-posts/controllers/free-posts.controller';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePost } from '@src/entities/FreePost';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostRepository]),
    CommonPostsModule.forFeature(FreePost),
    ReactionsModule.forFeature(FreePostReaction),
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
  exports: [FreePostsService],
})
export class FreePostsModule {}
