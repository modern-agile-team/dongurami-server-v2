import { Module } from '@nestjs/common';

import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubCategoryLinkRepository])],
  exports: [TypeOrmExModule],
})
export class ClubCategoryLinksModule {}
