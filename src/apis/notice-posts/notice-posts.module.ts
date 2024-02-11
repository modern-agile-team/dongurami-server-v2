import { Module } from '@nestjs/common';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { NoticePost } from '@src/entities/NoticePost';
import { QueryHelper } from '@src/helpers/query.helper';
import { CommonPostsModule } from '../common-posts/common-posts.module';
import { NoticePostsController } from './controllers/notice-posts.controller';
import { NoticePostsService } from './services/notice-posts.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([NoticePostRepository]),
    CommonPostsModule.forFeature(NoticePost),
  ],
  controllers: [NoticePostsController],
  providers: [NoticePostsService, QueryHelper],
})
export class NoticePostsModule {}
