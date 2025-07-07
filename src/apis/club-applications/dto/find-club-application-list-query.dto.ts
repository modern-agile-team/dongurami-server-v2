import { CLUB_APPLICATION_ORDER_FIELD } from '@src/apis/club-applications/constants/club-application.constant';
import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubApplicationListQueryDto
  extends PageDto
  implements Partial<Omit<ClubApplicationDto, 'answer'>>
{
  clubId?: string;

  status?: ClubApplicationStatus;

  order: Order<typeof CLUB_APPLICATION_ORDER_FIELD> = { id: SortOrder.Asc };

  constructor(
    findClubApplicationListQueryDto: Partial<FindClubApplicationListQueryDto> = {},
  ) {
    super();

    Object.assign(this, findClubApplicationListQueryDto);
  }
}
