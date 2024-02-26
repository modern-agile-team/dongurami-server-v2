import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';
import { POST_ORDER_FIELD } from '@src/apis/posts/constants/post.constant';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';
import { IsPositiveInt } from '@src/dto/validator/is-positive-int.decorator';

export class FindPostListQueryDto extends PageDto {
  @ApiPropertyOptional({
    description: '게시글 작성자 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: 'title 필터링',
  })
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOrder(POST_ORDER_FIELD)
  @CsvToOrder<typeof POST_ORDER_FIELD>([...POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof POST_ORDER_FIELD> = { createdAt: SortOrder.Asc };

  @IsDefined()
  status: FreePostStatus | NoticePostStatus = FreePostStatus.Posting;
}
