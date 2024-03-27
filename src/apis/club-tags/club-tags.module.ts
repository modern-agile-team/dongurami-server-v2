import { Module } from '@nestjs/common';

import { ClubTagRepository } from '@src/apis/club-tags/repositories/club-tag.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubTagRepository])],
  exports: [TypeOrmExModule],
})
export class ClubTagsModule {}
