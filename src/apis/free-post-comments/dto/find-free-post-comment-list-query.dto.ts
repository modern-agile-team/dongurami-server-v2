import { IsDefined, IsOptional } from 'class-validator';

import { FREE_POST_COMMENT_ORDER_FIELD } from '@src/apis/free-post-comments/constants/free-post-comment.constant';
import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindFreePostCommentListQueryDto
  extends PageDto
  implements Partial<FreePostCommentDto>
{
  @ApiPropertyOrder(FREE_POST_COMMENT_ORDER_FIELD)
  @CsvToOrder<typeof FREE_POST_COMMENT_ORDER_FIELD>([
    ...FREE_POST_COMMENT_ORDER_FIELD,
  ])
  @IsOptional()
  order: Order<typeof FREE_POST_COMMENT_ORDER_FIELD> = { id: SortOrder.Desc };

  /**
   * 대댓글의 깊이가 1인 정책을 우선 백엔드에서 가져가고 변경사항이 있을 경우 처리
   */
  @IsDefined()
  loadDepth: number = 1;

  @IsDefined()
  status: FreePostCommentStatus = FreePostCommentStatus.Posting;
}
