import { Module } from '@nestjs/common';
import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePost } from '@src/entities/FreePost';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreePostsController } from './controllers/free-posts.controller';
import { FreePostsService } from './services/free-posts.service';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostRepository]),
    CommonPostsModule.forFeature(FreePost),
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
})
export class FreePostsModule {}
