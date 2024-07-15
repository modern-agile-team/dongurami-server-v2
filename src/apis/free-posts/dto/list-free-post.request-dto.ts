import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
} from 'class-validator';

import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import {
  FREE_POST_ORDER_FIELD,
  FreePost,
} from '@src/apis/free-posts/entities/free-post.entity';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import {
  CsvToOrderV2,
  OrderV2,
} from '@src/dto/transformer/csv-to-order.decorator';
import { transformStringToBoolean } from '@src/dto/transformer/transform-string-to-boolean.transformer';

export class ListFreePostRequestDto
  extends PageDto
  implements Partial<FreePostDto>
{
  @ApiPropertyOptional({
    description: '자유게시글 고유 ID 필터링',
    format: 'int64',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  id?: string;

  @ApiPropertyOptional({
    description: '자유게시글 작성자 고유 ID 필터링',
    format: 'int64',
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  userId?: string;

  @ApiPropertyOptional({
    description: 'title 필터링',
    maxLength: FreePost.TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(FreePost.TITLE_LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({
    description: '익명여부 필터링',
    enum: ['true', 'false', '0', '1'],
  })
  @IsBoolean()
  @Transform(transformStringToBoolean)
  @IsOptional()
  isAnonymous?: boolean;

  @ApiPropertyOrder(FREE_POST_ORDER_FIELD)
  @CsvToOrderV2<typeof FREE_POST_ORDER_FIELD>([...FREE_POST_ORDER_FIELD])
  @IsOptional()
  order: OrderV2<typeof FREE_POST_ORDER_FIELD> = [{ id: SortOrder.Asc }];
}
