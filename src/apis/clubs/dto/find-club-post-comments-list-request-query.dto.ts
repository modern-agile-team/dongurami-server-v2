import { IsDefined, IsOptional } from 'class-validator';

import { CLUB_POST_COMMENT_ORDER_FIELD } from '@src/apis/club-post-comments/constants/club-post-comment.constant';
import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { FindAndCountClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-and-count-club-post-comments.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubPostCommentsListRequestQueryDto
  extends PageDto
  implements
    Pick<
      FindAndCountClubPostCommentsDto,
      'status' | 'order' | 'page' | 'pageSize' | 'loadDepth'
    >
{
  @ApiPropertyOrder(CLUB_POST_COMMENT_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_POST_COMMENT_ORDER_FIELD>([
    ...CLUB_POST_COMMENT_ORDER_FIELD,
  ])
  @IsOptional()
  order: Order<typeof CLUB_POST_COMMENT_ORDER_FIELD> = {
    createdAt: SortOrder.Asc,
  };

  @IsDefined()
  status: ClubPostCommentStatus = ClubPostCommentStatus.Posting;

  @IsDefined()
  loadDepth: number = 1;
}
