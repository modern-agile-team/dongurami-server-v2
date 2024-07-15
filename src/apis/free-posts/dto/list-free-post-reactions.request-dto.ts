import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNumberString, IsOptional } from 'class-validator';

import { FREE_POST_REACTION_ORDER_FIELD } from '@src/apis/free-posts/entities/free-post.entity';
import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import {
  CsvToOrderV2,
  OrderV2,
} from '@src/dto/transformer/csv-to-order.decorator';

export class ListFreePostReactionRequestDto extends PageDto {
  @ApiPropertyOptional({
    description: '리액션 생성 유저 고유 ID 필터링',
    format: 'int64',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  userId?: string;

  @ApiPropertyOptional({
    description: '리액션 타입 필터링',
    enum: ReactionName,
  })
  @IsOptional()
  @IsEnum(ReactionName)
  type?: ReactionName;

  @ApiPropertyOrder(FREE_POST_REACTION_ORDER_FIELD)
  @CsvToOrderV2<typeof FREE_POST_REACTION_ORDER_FIELD>([
    ...FREE_POST_REACTION_ORDER_FIELD,
  ])
  @IsOptional()
  order: OrderV2<typeof FREE_POST_REACTION_ORDER_FIELD> = [
    { id: SortOrder.Asc },
  ];
}
