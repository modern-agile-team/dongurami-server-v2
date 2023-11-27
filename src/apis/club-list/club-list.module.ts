import { Module } from '@nestjs/common';
import { ClubListController } from './club-list.controller';
import { ClubListService } from './club-list.service';

@Module({
  controllers: [ClubListController],
  providers: [ClubListService]
})
export class ClubListModule {}
