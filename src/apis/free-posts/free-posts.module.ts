import { Module } from '@nestjs/common';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreePostsController } from './controllers/free-posts.controller';
import { FreePostsService } from './services/free-posts.service';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostRepository]),
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
})
export class FreePostsModule {}
