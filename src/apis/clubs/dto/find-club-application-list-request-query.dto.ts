import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { CLUB_APPLICATION_ORDER_FIELD } from '@src/apis/club-applications/constants/club-application.constant';
import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubApplicationListRequestQueryDto
  extends PageDto
  implements Partial<Omit<ClubApplicationDto, 'answer'>>
{
  @ApiPropertyOptional({
    description: '동아리 지원서 상태 필터링',
  })
  @IsEnum(ClubApplicationStatus)
  @IsOptional()
  status?: ClubApplicationStatus;

  @ApiPropertyOrder(CLUB_APPLICATION_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_APPLICATION_ORDER_FIELD>([
    ...CLUB_APPLICATION_ORDER_FIELD,
  ])
  @IsOptional()
  order: Order<typeof CLUB_APPLICATION_ORDER_FIELD> = { id: SortOrder.Asc };
}
