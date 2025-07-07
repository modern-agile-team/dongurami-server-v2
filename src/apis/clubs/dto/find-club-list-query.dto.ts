import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDefined,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

import { CLUB_ORDER_FIELD } from '@src/apis/clubs/constants/club.constant';
import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindClubListQueryDto extends PageDto implements Partial<ClubDto> {
  @ApiPropertyOptional({
    description: '동아리 명',
  })
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: '동아리 카테고리 ID',
    format: 'int64',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  categoryId?: string;

  @ApiPropertyOptional({
    description: '동아리 태그 ID',
    format: 'int64',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  tagId: string;

  @ApiPropertyOrder(CLUB_ORDER_FIELD)
  @CsvToOrder<typeof CLUB_ORDER_FIELD>([...CLUB_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof CLUB_ORDER_FIELD> = { id: SortOrder.Asc };

  @IsDefined()
  status: ClubStatus = ClubStatus.Active;
}
