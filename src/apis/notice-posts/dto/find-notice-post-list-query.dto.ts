import { PageDto } from '@src/dto/page.dto';
import { NoticePostDto } from './notice-post.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDefined,
  IsOptional,
  Length,
} from 'class-validator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';
import {
  NOTICE_POST_ORDER_FIELD,
  NOTICE_POST_TITLE_LENGTH,
} from '../constants/notice-post.constant';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { SortOrder } from '@src/constants/enum';
import { NoticePostStatus } from '../constants/notice-post.enum';

export class FindNoticePostListQueryDto
  extends PageDto
  implements Partial<NoticePostDto>
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
    minLength: NOTICE_POST_TITLE_LENGTH.MIN,
    maxLength: NOTICE_POST_TITLE_LENGTH.MAX,
  })
  @Length(NOTICE_POST_TITLE_LENGTH.MIN, NOTICE_POST_TITLE_LENGTH.MAX)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: '댓글 허용 여부',
    enum: ['true', 'false'],
  })
  @IsBooleanString()
  @IsOptional()
  isAllowComment?: boolean;

  @ApiPropertyOrder(NOTICE_POST_ORDER_FIELD)
  @CsvToOrder<typeof NOTICE_POST_ORDER_FIELD>([...NOTICE_POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof NOTICE_POST_ORDER_FIELD> = { id: SortOrder.Desc };

  @IsDefined()
  status: NoticePostStatus.Posting = NoticePostStatus.Posting;
}
