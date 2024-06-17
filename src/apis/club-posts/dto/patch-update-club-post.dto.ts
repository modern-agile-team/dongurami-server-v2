import { PickType } from '@nestjs/swagger';

import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';

export class PatchUpdateClubPostDto extends PickType(ClubPostDto, [
  'userId',
  'description',
  'tags',
]) {
  postId: number;
  attachmentPaths: string[];

  constructor(patchUpdateClubPostDto: Partial<PatchUpdateClubPostDto> = {}) {
    super();

    Object.assign(this, patchUpdateClubPostDto);
  }
}
