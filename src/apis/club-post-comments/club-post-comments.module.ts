import { Module } from '@nestjs/common';

import { ClubPostCommentsService } from '@src/apis/club-post-comments/services/club-post-comments.service';

@Module({
  providers: [ClubPostCommentsService],
})
export class ClubPostCommentsModule {}
