import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  FREE_BOARD_ORDER_FIELD,
  FREE_BOARD_TITLE_LENGTH,
} from '@src/apis/free-boards/constants/free-board.constant';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';
import { Type } from 'class-transformer';
import { IsBooleanString, IsOptional, MaxLength } from 'class-validator';

export class FindFreeBoardListQueryDto
  extends PageDto
  implements Partial<FreeBoardDto>
{
  @ApiPropertyOptional({
    description: '자유게시글 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '자유게시글 작성자 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: 'title 필터링',
    maxLength: FREE_BOARD_TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @MaxLength(FREE_BOARD_TITLE_LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({
    description: '익명여부 필터링',
    enum: ['true', 'false', '0', '1'],
  })
  @IsBooleanString()
  @IsOptional()
  @Type(() => Boolean)
  isAnonymous?: boolean;

  @ApiPropertyOrder(FREE_BOARD_ORDER_FIELD)
  @CsvToOrder<typeof FREE_BOARD_ORDER_FIELD>([...FREE_BOARD_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof FREE_BOARD_ORDER_FIELD> = { id: SortOrder.Desc };
}
