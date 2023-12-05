import { PageDto } from '@src/dto/page.dto';
import { NoticeBoardDto } from './notice-board.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDefined,
  IsOptional,
  Length,
} from 'class-validator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';
import {
  NOTICE_BOARD_ORDER_FIELD,
  NOTICE_BOARD_TITLE_LENGTH,
} from '../constants/notice-board.constant';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { SortOrder } from '@src/constants/enum';
import { NoticeBoardStatus } from '../constants/notice-board.enum';

export class FindNoticeBoardListQueryDto
  extends PageDto
  implements Partial<NoticeBoardDto>
{
  @ApiPropertyOptional({
    description: '공지게시글 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '공지게시글 작성자 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: 'title 필터링',
    minLength: NOTICE_BOARD_TITLE_LENGTH.MIN,
    maxLength: NOTICE_BOARD_TITLE_LENGTH.MAX,
  })
  @Length(NOTICE_BOARD_TITLE_LENGTH.MIN, NOTICE_BOARD_TITLE_LENGTH.MAX)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: '댓글 허용 여부',
    enum: ['true', 'false'],
  })
  @IsBooleanString()
  @IsOptional()
  isAllowComment?: boolean;

  @ApiPropertyOrder(NOTICE_BOARD_ORDER_FIELD)
  @CsvToOrder<typeof NOTICE_BOARD_ORDER_FIELD>([...NOTICE_BOARD_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof NOTICE_BOARD_ORDER_FIELD> = { id: SortOrder.Desc };

  @ApiProperty({
    description:
      '게시글 상태(posting: 게시글 작성된 상태, remove: 게시글 삭제된 상태)',
    default: NoticeBoardStatus.Posting,
  })
  @IsDefined()
  status: NoticeBoardStatus.Posting;
}
