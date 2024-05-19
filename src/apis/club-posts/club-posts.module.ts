import { Module } from '@nestjs/common';

import { AttachmentsModule } from '@src/apis/attachments/attachments.module';
import { ClubPostAttachmentsModule } from '@src/apis/club-post-attachments/club-post-attachments.module';
import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';
import { ClubPostsService } from '@src/apis/club-posts/services/club-posts.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ClubPostRepository]),
    AttachmentsModule,
    ClubPostAttachmentsModule,
  ],
  providers: [ClubPostsService, QueryHelper],
  exports: [ClubPostsService],
})
export class ClubPostsModule {}
