import { Module } from '@nestjs/common';

import { RootController } from '@src/apis/root/controllers/root.controller';
import { RootService } from '@src/apis/root/services/root.service';

@Module({
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}
