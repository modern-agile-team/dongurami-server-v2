import { Module } from '@nestjs/common';

import { PostTagsController } from '@src/apis/post-tags/controllers/post-tags.controller';
import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';

@Module({
  controllers: [PostTagsController],
  providers: [PostTagsService],
})
export class PostTagsModule {}
