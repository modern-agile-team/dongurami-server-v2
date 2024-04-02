import { Module } from '@nestjs/common';

import { ClubTagLinksModule } from '@src/apis/club-tag-links/club-tag-links.module';
import { ClubTagRepository } from '@src/apis/club-tags/repositories/club-tag.repository';
import { ClubTagsService } from '@src/apis/club-tags/services/club-tags.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [
    ClubTagLinksModule,
    TypeOrmExModule.forCustomRepository([ClubTagRepository]),
  ],
  providers: [ClubTagsService],
  exports: [ClubTagsService, TypeOrmExModule],
})
export class ClubTagsModule {}
