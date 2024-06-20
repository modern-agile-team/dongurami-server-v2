import { IsDefined, IsOptional } from 'class-validator';

import { CLUB_POST_COMMENT_ORDER_FIELD } from '@src/apis/club-post-comments/constants/club-post-comment.constant';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubPostCommentsListRequestQueryDto extends PageDto {
  @ApiPropertyOrder(CLUB_POST_COMMENT_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_POST_COMMENT_ORDER_FIELD>([
    ...CLUB_POST_COMMENT_ORDER_FIELD,
  ])
  @IsOptional()
  order: Order<typeof CLUB_POST_COMMENT_ORDER_FIELD> = {
    createdAt: SortOrder.Asc,
  };

  @IsDefined()
  status: ClubPostStatus = ClubPostStatus.Posting;
}
