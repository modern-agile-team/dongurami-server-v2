import { PickType } from '@nestjs/mapped-types';

import { PatchUpdateClubPostCommentDto } from '@src/apis/club-post-comments/dto/patch-update-club-post-comment.dto';

export class RemoveClubPostCommentDto extends PickType(
  PatchUpdateClubPostCommentDto,
  ['id', 'clubPostId', 'userId'] as const,
) {
  constructor(removeClubPostCommentDto: RemoveClubPostCommentDto) {
    super();

    this.id = removeClubPostCommentDto.id;
    this.clubPostId = removeClubPostCommentDto.clubPostId;
    this.userId = removeClubPostCommentDto.userId;
  }
}
