import { Module } from '@nestjs/common';

import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';
import { ClubPostsService } from '@src/apis/club-posts/services/club-posts.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubPostRepository])],
  providers: [ClubPostsService],
  exports: [ClubPostsService],
})
export class ClubPostsModule {}
