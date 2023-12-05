import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { FreePostHistoryService } from './services/free-post-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([FreePostHistory])],
  providers: [FreePostHistoryService],
  exports: [FreePostHistoryService],
})
export class FreePostHistoryModule {}
