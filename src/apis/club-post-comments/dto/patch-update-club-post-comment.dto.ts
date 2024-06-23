import { PatchUpdateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/patch-update-club-post-comment-request-body.dto';

export class PatchUpdateClubPostCommentDto extends PatchUpdateClubPostCommentRequestBodyDto {
  id: number;

  userId: number;

  clubPostId: number;

  constructor(
    patchUpdateClubPostCommentDto: Partial<PatchUpdateClubPostCommentDto> = {},
  ) {
    super();

    const { id, clubPostId, userId, parentId, description, isAnonymous } =
      patchUpdateClubPostCommentDto;

    this.id = id;
    this.clubPostId = clubPostId;
    this.userId = userId;

    if (parentId !== undefined) {
      this.parentId = parentId;
    }

    if (description !== undefined) {
      this.description = description;
    }

    if (isAnonymous !== undefined) {
      this.isAnonymous = isAnonymous;
    }
  }
}
