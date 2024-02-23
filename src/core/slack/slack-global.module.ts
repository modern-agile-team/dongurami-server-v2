import { Global, Module } from '@nestjs/common';
import { SlackGlobalService } from './slack-global.service';

@Global()
@Module({
  providers: [SlackGlobalService],
  exports: [SlackGlobalService],
})
export class SlackGlobalModule {}
