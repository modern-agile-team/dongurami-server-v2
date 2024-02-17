import { IsDefined, IsOptional } from 'class-validator';

import { FreePostReplyCommentStatus } from '@src/apis/free-post-reply-comments/constants/free-post-reply-comment.enum';
import { FreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comment.dto';
import { FREE_POST_ORDER_FIELD } from '@src/apis/free-posts/constants/free-post.constant';
import { SortOrder } from '@src/constants/enum';
import { PageDto } from '@src/dto/page.dto';
import { ApiPropertyOrder } from '@src/dto/swagger/api-property-order.decorator';
import { CsvToOrder, Order } from '@src/dto/transformer/csv-to-order.decorator';

export class FindFreePostReplyCommentListQueryDto
  extends PageDto
  implements Partial<FreePostReplyCommentDto>
{
  @ApiPropertyOrder(FREE_POST_ORDER_FIELD)
  @CsvToOrder<typeof FREE_POST_ORDER_FIELD>([...FREE_POST_ORDER_FIELD])
  @IsOptional()
  order: Order<typeof FREE_POST_ORDER_FIELD> = { id: SortOrder.Desc };

  @IsDefined()
  status: FreePostReplyCommentStatus = FreePostReplyCommentStatus.Posting;
}
