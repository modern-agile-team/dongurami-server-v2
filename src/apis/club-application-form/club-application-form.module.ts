import { Module } from '@nestjs/common';

import { ClubApplicationFormRepository } from '@src/apis/club-application-form/repositories/club-application-form.repository';
import { ClubApplicationFormService } from '@src/apis/club-application-form/services/club-application-form.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ClubApplicationFormRepository]),
  ],
  providers: [ClubApplicationFormService],
  exports: [ClubApplicationFormService],
})
export class ClubApplicationFormModule {}
