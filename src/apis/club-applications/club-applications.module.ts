import { Module } from '@nestjs/common';

import { ClubApplicationFormModule } from '@src/apis/club-application-form/club-application-form.module';
import { ClubApplicationRepository } from '@src/apis/club-applications/repositories/club-application.repository';
import { ClubApplicationsService } from '@src/apis/club-applications/services/club-applications.service';
import { ClubMembersModule } from '@src/apis/club-members/club-members.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    ClubApplicationFormModule,
    ClubMembersModule,
    TypeOrmExModule.forCustomRepository([ClubApplicationRepository]),
  ],
  providers: [ClubApplicationsService, QueryHelper],
  exports: [ClubApplicationsService],
})
export class ClubApplicationsModule {}
