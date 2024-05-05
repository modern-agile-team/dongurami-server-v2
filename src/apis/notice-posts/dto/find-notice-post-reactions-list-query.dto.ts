import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { NOTICE_POST_REACTION_ORDER_FIELD } from '@src/apis/notice-posts/constants/notice-post.constant';
import { NoticePostReactionDto } from '@src/apis/notice-posts/dto/notice-post-reaction.dto';
import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';

export class FindNoticePostReactionListQueryDto
  extends PageDto
  implements Partial<Pick<NoticePostReactionDto, 'userId' | 'type'>>
{
  @ApiPropertyOptional({
    description: '리액션 생성 유저 고유 ID 필터링',
    format: 'integer',
    minimum: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: '리액션 타입 필터링',
    enum: ReactionName,
  })
  @IsOptional()
  @IsEnum(ReactionName)
  type?: ReactionName;

  @ApiPropertyOrder(NOTICE_POST_REACTION_ORDER_FIELD)
  @CsvToOrder<typeof NOTICE_POST_REACTION_ORDER_FIELD>([
    ...NOTICE_POST_REACTION_ORDER_FIELD,
  ])
  @IsOptional()
  order: Order<typeof NOTICE_POST_REACTION_ORDER_FIELD> = { id: SortOrder.Asc };
}
