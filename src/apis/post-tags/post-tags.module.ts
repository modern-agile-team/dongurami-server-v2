import { Module } from '@nestjs/common';

import { PostTagsController } from '@src/apis/post-tags/controllers/post-tags.controller';
import { PostTagRepository } from '@src/apis/post-tags/repositories/post-tag.repository';
import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([PostTagRepository])],
  controllers: [PostTagsController],
  providers: [PostTagsService],
})
export class PostTagsModule {}
