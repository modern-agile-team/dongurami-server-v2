import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { CLUB_POST_ORDER_FIELD } from '@src/apis/club-posts/constants/club-post.constant';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubPostListRequestQueryDto
  extends PageDto
  implements Partial<Pick<ClubPostDto, 'description'>>
{
  @ApiPropertyOptional({
    description: '게시글 본문 필터링',
    minLength: 1,
  })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOrder(CLUB_POST_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_POST_ORDER_FIELD>([...CLUB_POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof CLUB_POST_ORDER_FIELD> = { createdAt: SortOrder.Asc };

  @IsDefined()
  status: ClubPostStatus = ClubPostStatus.Posting;
}
