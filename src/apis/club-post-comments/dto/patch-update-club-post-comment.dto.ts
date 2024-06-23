import { PatchUpdateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/patch-update-club-post-comment-request-body.dto';

export class PatchUpdateClubPostCommentDto extends PatchUpdateClubPostCommentRequestBodyDto {
  id: number;

  userId: number;

  clubId: number;

  clubPostId: number;

  constructor(
    patchUpdateClubPostCommentDto: Partial<PatchUpdateClubPostCommentDto> = {},
  ) {
    super();

    Object.assign(this, patchUpdateClubPostCommentDto);
  }
}
