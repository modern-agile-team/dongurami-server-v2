import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { FreePost } from '@src/entities/FreePost';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreePostsController } from './controllers/free-posts.controller';
import { FreePostsService } from './services/free-posts.service';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmModule.forFeature([FreePost, FreePostHistory]),
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
})
export class FreePostsModule {}
