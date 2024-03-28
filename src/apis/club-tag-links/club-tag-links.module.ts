import { Module } from '@nestjs/common';

import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { ClubTagLinksService } from '@src/apis/club-tag-links/services/club-tag-links.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubTagLinkRepository])],
  providers: [ClubTagLinksService],
  exports: [ClubTagLinksService, TypeOrmExModule],
})
export class ClubTagLinksModule {}
