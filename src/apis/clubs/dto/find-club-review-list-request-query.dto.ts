import { IsDefined, IsOptional } from 'class-validator';

import { CLUB_REVIEW_ORDER_FIELD } from '@src/apis/club-reviews/constants/club-review.constant';
import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubReviewListRequestQueryDto extends PageDto {
  @ApiPropertyOrder(CLUB_REVIEW_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_REVIEW_ORDER_FIELD>([...CLUB_REVIEW_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof CLUB_REVIEW_ORDER_FIELD> = { id: SortOrder.Asc };

  @IsDefined()
  status: ClubReviewStatus = ClubReviewStatus.Posting;
}
