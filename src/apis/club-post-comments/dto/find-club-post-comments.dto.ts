import { CLUB_POST_COMMENT_ORDER_FIELD } from '@src/apis/club-post-comments/constants/club-post-comment.constant';
import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { SortOrder } from '@src/constants/enum';
import { Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubPostCommentsDto
  implements Partial<Pick<ClubPostCommentDto, 'depth' | 'status' | 'parentId'>>
{
  clubPostId?: number | number[];

  status: ClubPostCommentStatus = ClubPostCommentStatus.Posting;

  order: Order<typeof CLUB_POST_COMMENT_ORDER_FIELD> = { id: SortOrder.Asc };

  constructor(findClubPostCommentsDto: Partial<FindClubPostCommentsDto> = {}) {
    Object.assign(this, findClubPostCommentsDto);
  }
}
