import { Module } from '@nestjs/common';
import { AdminOptionController } from './controllers/admin-option.controller';
import { AdminOptionService } from './services/admin-option.service';

@Module({
  controllers: [AdminOptionController],
  providers: [AdminOptionService],
})
export class AdminOptionModule {}
