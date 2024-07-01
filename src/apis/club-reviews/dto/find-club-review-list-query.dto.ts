import { CLUB_REVIEW_ORDER_FIELD } from '@src/apis/club-reviews/constants/club-review.constant';
import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubReviewListQueryDto
  extends PageDto
  implements Partial<Pick<ClubReviewDto, 'clubId' | 'status'>>
{
  clubId?: string;

  status?: ClubReviewStatus;

  order: Order<typeof CLUB_REVIEW_ORDER_FIELD> = { id: SortOrder.Asc };

  constructor(
    findClubReviewListQueryDto: Partial<FindClubReviewListQueryDto> = {},
  ) {
    super();

    Object.assign(this, findClubReviewListQueryDto);
  }
}
