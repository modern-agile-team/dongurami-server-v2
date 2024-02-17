import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsDefined, IsOptional, Length } from 'class-validator';
import { IsBoolean } from 'class-validator';

import {
  NOTICE_POST_ORDER_FIELD,
  NOTICE_POST_TITLE_LENGTH,
} from '@src/apis/notice-posts/constants/notice-post.constant';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';
import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { transformStringToBoolean } from '@src/dto/transformer/transform-string-to-boolean.transformer';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';

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
  @IsBoolean()
  @Transform(transformStringToBoolean)
  @IsOptional()
  isAllowComment?: boolean;

  @ApiPropertyOrder(NOTICE_POST_ORDER_FIELD)
  @CsvToOrder<typeof NOTICE_POST_ORDER_FIELD>([...NOTICE_POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof NOTICE_POST_ORDER_FIELD> = { id: SortOrder.Desc };

  @IsDefined()
  status: NoticePostStatus.Posting = NoticePostStatus.Posting;
}
