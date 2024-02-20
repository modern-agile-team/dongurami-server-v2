import { Module } from '@nestjs/common';

import { DevController } from '@src/apis/dev/controllers/dev.controller';

@Module({
  controllers: [DevController],
})
export class DevModule {}
