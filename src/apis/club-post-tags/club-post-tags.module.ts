import { Module } from '@nestjs/common';

import { ClubPostTagRepository } from '@src/apis/club-post-tags/repositories/club-post-tag.repository';
import { ClubPostTagsService } from '@src/apis/club-post-tags/services/club-post-tags.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubPostTagRepository])],
  providers: [ClubPostTagsService],
  exports: [TypeOrmExModule, ClubPostTagsService],
})
export class ClubPostTagsModule {}
