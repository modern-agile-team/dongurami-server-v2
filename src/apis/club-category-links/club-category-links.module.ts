import { Module } from '@nestjs/common';

import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { ClubCategoryLinksService } from '@src/apis/club-category-links/services/club-category-links.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubCategoryLinkRepository])],
  providers: [ClubCategoryLinksService],
  exports: [ClubCategoryLinksService, TypeOrmExModule],
})
export class ClubCategoryLinksModule {}
