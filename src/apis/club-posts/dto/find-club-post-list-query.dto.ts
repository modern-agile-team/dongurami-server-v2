import { CLUB_POST_ORDER_FIELD } from '@src/apis/club-posts/constants/club-post.constant';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubPostListQueryDto
  extends PageDto
  implements Partial<Pick<ClubPostDto, 'clubId' | 'status' | 'description'>>
{
  clubId?: string;

  description?: string;

  status?: ClubPostStatus;

  order: Order<typeof CLUB_POST_ORDER_FIELD> = { id: SortOrder.Asc };

  constructor(
    findClubPostListQueryDto: Partial<FindClubPostListQueryDto> = {},
  ) {
    super();

    Object.assign(this, findClubPostListQueryDto);
  }
}
