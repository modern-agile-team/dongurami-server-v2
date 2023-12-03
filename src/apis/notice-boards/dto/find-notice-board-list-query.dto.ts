import { PageDto } from '@src/dto/page.dto';
import { NoticeBoardDto } from './notice-board.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';
import {
  NOTICE_BOARD_ORDER_FIELD,
  NOTICE_BOARD_TITLE_LENGTH,
} from '../constants/notice-board.constant';
import { Type } from 'class-transformer';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { FREE_BOARD_ORDER_FIELD } from '@src/apis/free-boards/constants/free-board.constant';
import { SortOrder } from '@src/constants/enum';

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
    maxLength: NOTICE_BOARD_TITLE_LENGTH.MAX,
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: '댓글 허용 여부',
    enum: ['true', 'false', '0', '1'],
  })
  @IsBooleanString()
  @IsOptional()
  @Type(() => Boolean)
  allowComment?: boolean;

  @ApiPropertyOrder(NOTICE_BOARD_ORDER_FIELD)
  @CsvToOrder<typeof NOTICE_BOARD_ORDER_FIELD>([...NOTICE_BOARD_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof NOTICE_BOARD_ORDER_FIELD> = { id: SortOrder.Desc };
}
