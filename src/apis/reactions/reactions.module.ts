import { Module } from '@nestjs/common';
import { ReactionsService } from './services/reactions.service';

@Module({
  providers: [ReactionsService],
})
export class ReactionsModule {}
