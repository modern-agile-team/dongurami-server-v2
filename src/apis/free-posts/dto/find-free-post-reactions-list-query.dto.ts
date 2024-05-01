import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { FREE_POST_REACTION_ORDER_FIELD } from '@src/apis/free-posts/constants/free-post.constant';
import { FreePostReactionDto } from '@src/apis/free-posts/dto/free-post-reaction.dto';
import { ReactionType } from '@src/apis/reactions/constants/reaction.enum';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';

export class FindFreePostReactionListQueryDto
  extends PageDto
  implements Partial<Pick<FreePostReactionDto, 'userId' | 'type'>>
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
    enum: ReactionType,
  })
  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;

  @ApiPropertyOrder(FREE_POST_REACTION_ORDER_FIELD)
  @CsvToOrder<typeof FREE_POST_REACTION_ORDER_FIELD>([
    ...FREE_POST_REACTION_ORDER_FIELD,
  ])
  order: Order<typeof FREE_POST_REACTION_ORDER_FIELD> = { id: SortOrder.Asc };
}
