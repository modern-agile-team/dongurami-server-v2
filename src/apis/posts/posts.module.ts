import { Module } from '@nestjs/common';

import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { PostsController } from '@src/apis/posts/controllers/posts.controller';
import { PostRepository } from '@src/apis/posts/repositories/post.repository';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FreePostRepository,
      NoticePostRepository,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, QueryHelper],
})
export class PostsModule {}
