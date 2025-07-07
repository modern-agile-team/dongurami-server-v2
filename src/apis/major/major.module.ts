import { Module } from '@nestjs/common';

import { MajorController } from '@src/apis/major/controllers/major.controller';
import { MajorRepository } from '@src/apis/major/repositories/major.repository';
import { MajorService } from '@src/apis/major/services/major.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MajorRepository])],
  controllers: [MajorController],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
