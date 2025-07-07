import { Module } from '@nestjs/common';

import { ClubCategoriesController } from '@src/apis/club-categories/controllers/club-categories.controller';
import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { ClubCategoriesService } from '@src/apis/club-categories/services/club-categories.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubCategoryRepository])],
  controllers: [ClubCategoriesController],
  providers: [ClubCategoriesService, QueryHelper],
  exports: [ClubCategoriesService, TypeOrmExModule],
})
export class ClubCategoriesModule {}
