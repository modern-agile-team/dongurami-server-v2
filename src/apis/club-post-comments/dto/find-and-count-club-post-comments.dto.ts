import { IntersectionType } from '@nestjs/mapped-types';

import { FindClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-club-post-comments.dto';
import { PageDto } from '@src/dto/page.dto';

export class FindAndCountClubPostCommentsDto extends IntersectionType(
  FindClubPostCommentsDto,
  PageDto,
) {
  loadDepth: number;

  constructor(
    findAndCountClubPostCommentDto: Partial<FindAndCountClubPostCommentsDto> = {},
  ) {
    super();

    const { page, pageSize, clubPostId, status, order, loadDepth } =
      findAndCountClubPostCommentDto;

    this.page = page;
    this.pageSize = pageSize;
    this.clubPostId = clubPostId;
    this.status = status;
    this.order = order;
    this.loadDepth = loadDepth;
  }
}
