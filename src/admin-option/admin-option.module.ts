import { Module } from '@nestjs/common';
import { AdminOptionController } from './admin-option.controller';
import { AdminOptionService } from './admin-option.service';

@Module({
  controllers: [AdminOptionController],
  providers: [AdminOptionService]
})
export class AdminOptionModule {}
