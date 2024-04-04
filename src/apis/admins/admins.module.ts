import { Module } from '@nestjs/common';

import { AdminsController } from '@src/apis/admins/controllers/admins.controller';
import { ClubsModule } from '@src/apis/clubs/clubs.module';
import { MajorModule } from '@src/apis/major/major.module';

@Module({
  imports: [MajorModule, ClubsModule],
  controllers: [AdminsController],
})
export class AdminsModule {}
