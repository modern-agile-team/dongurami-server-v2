import { Module } from '@nestjs/common';

import { ClubMemberRepository } from '@src/apis/club-members/repositories/club-member.repository';
import { ClubMembersService } from '@src/apis/club-members/services/club-members.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubMemberRepository])],
  providers: [ClubMembersService],
  exports: [ClubMembersService],
})
export class ClubMembersModule {}
