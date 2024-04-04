import { Module } from '@nestjs/common';

import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubCategoryRepository])],
  exports: [TypeOrmExModule],
})
export class ClubCategoriesModule {}
