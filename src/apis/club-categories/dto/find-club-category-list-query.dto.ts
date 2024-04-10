import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, Length } from 'class-validator';

import {
  CLUB_CATEGORY_NAME,
  CLUB_CATEGORY_ORDER_FIELD,
} from '@src/apis/club-categories/constants/club-category.constant';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { SortOrder } from '@src/constants/enum';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubCategoryListQueryDto
  implements Partial<Pick<ClubCategoryDto, 'name'>>
{
  @ApiPropertyOptional({
    description: '카테고리 명 필터링',
    minLength: CLUB_CATEGORY_NAME.MIN,
    maxLength: CLUB_CATEGORY_NAME.MAX,
  })
  @IsOptional()
  @Length(CLUB_CATEGORY_NAME.MIN, CLUB_CATEGORY_NAME.MAX)
  name?: string;

  @ApiPropertyOrder(CLUB_CATEGORY_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_CATEGORY_ORDER_FIELD>([...CLUB_CATEGORY_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof CLUB_CATEGORY_ORDER_FIELD> = { id: SortOrder.Asc };
}
