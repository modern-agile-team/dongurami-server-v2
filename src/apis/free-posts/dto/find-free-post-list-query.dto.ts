import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  FREE_POST_ORDER_FIELD,
  FREE_POST_TITLE_LENGTH,
} from '@src/apis/free-posts/constants/free-post.constant';
import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class FindFreePostListQueryDto
  extends PageDto
  implements Partial<FreePostDto>
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
    maxLength: FREE_POST_TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(FREE_POST_TITLE_LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({
    description: '익명여부 필터링',
    enum: ['true', 'false', '0', '1'],
  })
  @IsBooleanString()
  @IsOptional()
  @Type(() => Boolean)
  isAnonymous?: boolean;

  @ApiPropertyOrder(FREE_POST_ORDER_FIELD)
  @CsvToOrder<typeof FREE_POST_ORDER_FIELD>([...FREE_POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof FREE_POST_ORDER_FIELD> = { id: SortOrder.Desc };

  @IsDefined()
  status: FreePostStatus = FreePostStatus.Posting;
}
