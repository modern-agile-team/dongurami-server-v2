import { Module } from '@nestjs/common';

import { RootService } from '@src/apis/root/services/root.service';

@Module({
  providers: [RootService],
  exports: [RootService],
})
export class RootModule {}
