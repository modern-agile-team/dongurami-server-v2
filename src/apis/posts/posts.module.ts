import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { PostsController } from '@src/apis/posts/controllers/posts.controller';
import { PostRepository } from '@src/apis/posts/repositories/post.repository';
import { PostsService } from '@src/apis/posts/services/posts.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePost } from '@src/entities/FreePost';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([FreePost]),
    TypeOrmExModule.forCustomRepository([NoticePostRepository]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, QueryHelper],
})
export class PostsModule {}
