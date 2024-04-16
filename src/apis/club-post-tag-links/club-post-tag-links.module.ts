import { Module } from '@nestjs/common';

import { ClubPostTagLinkRepository } from '@src/apis/club-post-tag-links/repositories/club-post-tag-link.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubPostTagLinkRepository])],
  exports: [TypeOrmExModule],
})
export class ClubPostTagLinksModule {}
