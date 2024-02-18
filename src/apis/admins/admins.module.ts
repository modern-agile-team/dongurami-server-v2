import { Module } from '@nestjs/common';

import { AdminsController } from '@src/apis/admins/controllers/admins.controller';
import { MajorModule } from '@src/apis/major/major.module';

@Module({
  imports: [MajorModule],
  controllers: [AdminsController],
})
export class AdminsModule {}
