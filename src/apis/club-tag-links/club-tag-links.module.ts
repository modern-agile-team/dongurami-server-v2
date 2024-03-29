import { Module } from '@nestjs/common';

import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubTagLinkRepository])],
  exports: [TypeOrmExModule],
})
export class ClubTagLinksModule {}
